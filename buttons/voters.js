const { EmbedBuilder } = require('discord.js');
const Suggestion = require('../models/suggestionSchema');

module.exports = {
    customID: 'suggest_voters',

    async execute(interaction) {
        const messageId = interaction.message.id;
        const suggestion = await Suggestion.findOne({ messageId });

        if (!suggestion) {
            return interaction.reply({
                content: 'Suggestion not found.',
                ephemeral: true
            });
        }

        const upvoters = suggestion.upvotes.length > 0
            ? suggestion.upvotes.map(id => {
                const member = interaction.guild.members.cache.get(id);
                return member ? `${member.user.tag} (${id})` : `Unknown User (${id})`;
            }).join('\n')
            : 'No upvotes yet.';

        const downvoters = suggestion.downvotes.length > 0
            ? suggestion.downvotes.map(id => {
                const member = interaction.guild.members.cache.get(id);
                return member ? `${member.user.tag} (${id})` : `Unknown User (${id})`;
            }).join('\n')
            : 'No downvotes yet.';

        const embed = new EmbedBuilder()
            .setColor('#242429')
            .setTitle('Suggestion Voters')
            .setDescription(`**Suggestion:** ${suggestion.suggestion}`)
            .addFields(
                { name: 'Upvoters', value: upvoters, inline: true },
                { name: 'Downvoters', value: downvoters, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
