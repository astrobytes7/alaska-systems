const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Promotion = require('../models/promotionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promotion-revoke')
        .setDescription('Revoke a recorded promotion.')
        .addStringOption(option =>
            option
                .setName('promotion_id')
                .setDescription('Promotion ID to revoke')
                .setRequired(true)
        ),

    async execute(interaction) {
        const requiredRoleId = ''; // role id

        if (!interaction.guild.roles.cache.get(requiredRoleId)) {
            return interaction.reply({
                content: "The role set is currently invalid.",
            });
        }

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
            });
        }

        try {
            const promotionId = interaction.options.getString('promotion_id');
            const promo = await Promotion.findOne({ promotionId });

            if (!promo) {
                return interaction.reply({
                    content: 'No promotion found with that ID.',
                    ephemeral: true
                });
            }

            if (promo.revoked) {
                return interaction.reply({
                    content: 'This promotion has already been revoked.',
                    ephemeral: true
                });
            }

            const channelId = ''; // channel id
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Could not find the promotion log channel.',
                    ephemeral: true
                });
            }

            let msg;
            try {
                msg = await channel.messages.fetch(promo.messageId);
            } catch {
                return interaction.reply({
                    content: 'Could not fetch the original promotion message.',
                    ephemeral: true
                });
            }

            const originalEmbed = msg.embeds[0];
            if (!originalEmbed) {
                return interaction.reply({
                    content: 'Original promotion embed not found.',
                    ephemeral: true
                });
            }

            const updatedEmbed = EmbedBuilder.from(originalEmbed)
                .setFooter({ text: `Promotion ID: ${promo.promotionId} • Revoked by ${interaction.user.tag}` });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('revoked')
                    .setLabel('Revoked')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            );

            await msg.edit({
                embeds: [updatedEmbed],
                components: [row]
            });

            await Promotion.updateOne(
                { promotionId },
                { revoked: true, revokerId: interaction.user.id }
            );

            await interaction.reply({
                content: `Promotion ${promotionId} has been marked as revoked.`,
                ephemeral: false
            });
        } catch (error) {
            console.error('Error revoking promotion:', error);
            await interaction.reply({
                content: 'Error revoking promotion.',
                ephemeral: true
            });
        }
    }
};
