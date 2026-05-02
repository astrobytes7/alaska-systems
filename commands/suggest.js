const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Suggestion = require('../models/suggestionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion.')
        .addStringOption(option =>
            option
                .setName('suggestion')
                .setDescription('Your suggestion text')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const suggestionText = interaction.options.getString('suggestion');
            const user = interaction.user;

            const channelId = ''; // suggestion log channel id
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Could not find the suggestion log channel.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#242429')
                .setAuthor({
                    name: user.username,
                    iconURL: user.displayAvatarURL()
                })
                .setTitle('New Suggestion')
                .setDescription(`**Suggestion:** ${suggestionText}\n\nUpvotes: 0%\nDownvotes: 0%`)
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6914870f&is=6913358f&hm=ca3406181cba40825ab309d5a11407a070218d2fa38aaf424610d311ebe72ec6&=&format=webp&quality=lossless&width=2576&height=120")
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('suggest_upvote')
                    .setLabel('Upvote')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('suggest_downvote')
                    .setLabel('Downvote')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('suggest_voters')
                    .setLabel('Voters')
                    .setStyle(ButtonStyle.Secondary)
            );

            const msg = await channel.send({ embeds: [embed], components: [row] });

            await msg.startThread({
                name: `Suggestion: ${user.username}`,
                reason: 'Suggestion discussion thread'
            });

            await Suggestion.create({
                userId: user.id,
                messageId: msg.id,
                suggestion: suggestionText
            });

            await interaction.reply({
                content: 'Your suggestion has been submitted.',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error submitting suggestion:', error);
            await interaction.reply({
                content: 'Failed to submit your suggestion.',
                ephemeral: true
            });
        }
    }
};
