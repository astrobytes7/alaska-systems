const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Infraction = require('../models/infractionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infraction-revoke')
        .setDescription('Revoke a recorded infraction.')
        .addStringOption(option =>
            option
                .setName('infraction_id')
                .setDescription('Infraction ID to revoke')
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
            const infractionId = interaction.options.getString('infraction_id');
            const inf = await Infraction.findOne({ infractionId });

            if (!inf) {
                return interaction.reply({
                    content: 'No infraction found with that ID.',
                    ephemeral: true
                });
            }

            if (inf.revoked) {
                return interaction.reply({
                    content: 'This infraction has already been revoked.',
                    ephemeral: true
                });
            }

            const channelId = ''; // channel id
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Could not find the infraction log channel.',
                    ephemeral: true
                });
            }

            let msg;
            try {
                msg = await channel.messages.fetch(inf.messageId);
            } catch {
                return interaction.reply({
                    content: 'Could not fetch the original infraction message.',
                    ephemeral: true
                });
            }

            const originalEmbed = msg.embeds[0];
            if (!originalEmbed) {
                return interaction.reply({
                    content: 'Original infraction embed not found.',
                    ephemeral: true
                });
            }

            const updatedEmbed = EmbedBuilder.from(originalEmbed)
                .setFooter({ text: `Infraction ID: ${inf.infractionId} • Revoked by ${interaction.user.tag}` });

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

            await Infraction.updateOne(
                { infractionId },
                { revoked: true, revokerId: interaction.user.id }
            );

            await interaction.reply({
                content: `Infraction ${infractionId} has been marked as revoked.`,
                ephemeral: false
            });
        } catch (error) {
            console.error('Error revoking infraction:', error);
            await interaction.reply({
                content: 'Error revoking infraction.',
                ephemeral: true
            });
        }
    }
};
