const SsuVote = require('../models/ssuvoteSchema');
const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    customID: 'votes',
    async execute(interaction) {
        const voteData = await SsuVote.findOne({});
        if (!voteData) {
            return interaction.reply({ content: 'No active session vote found.', flags: MessageFlags.Ephemeral, });
        }

        if (interaction.message.id !== voteData.messageId) {
            return interaction.reply({ content: 'This session vote is no longer active.', flags: MessageFlags.Ephemeral, });
        }
        
        if (voteData.voters.length === 0) {
            return interaction.reply({ content: 'No one has voted yet.', flags: MessageFlags.Ephemeral, });
        }

        const voterList = voteData.voters
            .map(id => {
                const member = interaction.guild.members.cache.get(id);
                return `**@${member?.user.tag || "Unknown"} (${id})**`;
            })
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#242429')
            .setTitle('Current Voters')
            .setDescription(voterList)
            .setTimestamp();

        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral, });
    }
};