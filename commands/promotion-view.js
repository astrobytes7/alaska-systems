const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Promotion = require('../models/promotionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promotion-view')
        .setDescription('View promotions by user or ID.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to view promotions for')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('promotion_id')
                .setDescription('Specific promotion ID to view')
                .setRequired(false)
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
            const user = interaction.options.getUser('user');
            const promotionId = interaction.options.getString('promotion_id');

            if (promotionId) {
                const promo = await Promotion.findOne({ promotionId });
                if (!promo) {
                    return interaction.reply({
                        content: 'No promotion found with that ID.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#242429')
                    .setTitle(`Promotion ${promo.promotionId}`)
                    .addFields(
                        { name: 'User', value: `<@${promo.userId}>`, inline: true },
                        { name: 'Promoter', value: `<@${promo.promoterId}>`, inline: true },
                        { name: 'New Rank', value: `<@&${promo.newRankId}>`, inline: true },
                        { name: 'Reason', value: promo.reason, inline: true },
                        { name: 'Date', value: `<t:${Math.floor(promo.timestamp.getTime() / 1000)}:f>`, inline: true },
                        { name: 'Revoked', value: promo.revoked ? `Yes (<@${promo.revokerId}> )` : 'No', inline: true },
                    );

                return interaction.reply({ embeds: [embed] });
            }

            if (user) {
                const promotions = await Promotion.find({ userId: user.id });
                if (!promotions.length) {
                    return interaction.reply({
                        content: 'No promotions found for that user.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#242429')
                    .setTitle(`Promotions for ${user.tag}`)
                    .setDescription(
                        promotions
                            .map(p => `**${p.promotionId}** — <@&${p.newRankId}> (${p.reason})`)
                            .join('\n')
                    );

                return interaction.reply({ embeds: [embed] });
            }

            return interaction.reply({
                content: 'Please provide either a user or a promotion ID.',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error fetching promotions:', error);
            await interaction.reply({
                content: 'Error fetching promotions.',
                ephemeral: true
            });
        }
    }
};
