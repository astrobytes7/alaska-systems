const SsuVote = require('../models/ssuvoteSchema');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customID: 'vote',
    async execute(interaction) {
        const voteData = await SsuVote.findOne({});
        if (!voteData) {
            return interaction.reply({ content: 'No active session vote found.', ephemeral: true });
        }

        if (interaction.message.id !== voteData.messageId) {
            return interaction.reply({ content: 'This session vote is no longer active.', ephemeral: true });
        }

        const userId = interaction.user.id;
        let voters = voteData.voters;
        let message;

        if (voters.includes(userId)) {
            voters = voters.filter(v => v !== userId);
            voteData.amount -= 1;
            message = `You have unvoted for this session successfully.`;
        } else {
            voters.push(userId);
            voteData.amount += 1;
            message = `You have voted for this session successfully.`;
        }

        voteData.voters = voters;
        await voteData.save();

        try {
            const channel = await interaction.guild.channels.fetch(voteData.channelId);
            const msg = await channel.messages.fetch(voteData.messageId);
            if (msg) {
                const row = ActionRowBuilder.from(msg.components[0]);

                row.components[0] = new ButtonBuilder()
                    .setLabel(`${voteData.amount}/${voteData.amountRequired}`)
                    .setCustomId('vote')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(voteData.amount >= voteData.amountRequired); 

                row.components[1] = new ButtonBuilder()
                    .setLabel('Votes')
                    .setCustomId('votes')
                    .setStyle(ButtonStyle.Secondary)

                await msg.edit({ components: [row] });
            }
        } catch (err) {
            console.error('Error updating vote button:', err);
        }

        return interaction.reply({ content: message, ephemeral: true });
    }
};
