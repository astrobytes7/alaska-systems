const Suggestion = require('../models/suggestionSchema');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    customID: 'suggest_upvote',
    async execute(interaction) {
        const messageId = interaction.message.id;
        const userId = interaction.user.id;

        const suggestion = await Suggestion.findOne({ messageId });
        if (!suggestion) return interaction.reaply({ content: 'Suggestion not found.', ephemeral: true });

        const hasUpvoted = suggestion.upvotes.includes(userId);
        const hasDownvoted = suggestion.downvotes.includes(userId);

        let feedback = '';

        if (hasUpvoted) {
            suggestion.upvotes.pull(userId);
            feedback = `You have removed your vote.`;
        } else {
            suggestion.upvotes.push(userId);
            if (hasDownvoted) suggestion.downvotes.pull(userId);
            feedback = `You have upvoted.`;
        }

        await suggestion.save();

        const total = suggestion.upvotes.length + suggestion.downvotes.length;
        const upPercent = total === 0 ? 0 : Math.round((suggestion.upvotes.length / total) * 100);
        const downPercent = total === 0 ? 0 : Math.round((suggestion.downvotes.length / total) * 100);

        const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription(`**Suggestion:** ${suggestion.suggestion}\n\nUpvotes: ${upPercent}%\nDownvotes: ${downPercent}%`);

        await interaction.update({ embeds: [updatedEmbed] });
        await interaction.followUp({ content: feedback, ephemeral: true });
    }
};
