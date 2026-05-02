const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Suggestion = require('../models/suggestionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deny-suggestion')
        .setDescription('Deny a suggestion by its message ID.')
        .addStringOption(option =>
            option
                .setName('message_id')
                .setDescription('The message ID of the suggestion')
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
            const messageId = interaction.options.getString('message_id');
            const suggestion = await Suggestion.findOne({ messageId });

            if (!suggestion) {
                return interaction.reply({
                    content: 'Suggestion not found.',
                    ephemeral: true
                });
            }

            const channelId = ''; // channel id
            const channel = await interaction.guild.channels.fetch(channelId);
            const msg = await channel.messages.fetch(messageId);

            const embed = EmbedBuilder.from(msg.embeds[0])
                .setColor('#242429')
                .setFooter({ text: `Denied by ${interaction.user.tag}` });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`denied`)
                    .setLabel('Denied')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            );

            await msg.edit({ embeds: [embed], components: [row] });

            await Suggestion.updateOne({ messageId }, { status: 'denied' });

            await interaction.reply({
                content: `Suggestion **${suggestion.suggestion}** denied.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error denyinh suggestion:', error);
            await interaction.reply({
                content: 'Failed to deny the suggestion.',
                ephemeral: true
            });
        }
    }
};
