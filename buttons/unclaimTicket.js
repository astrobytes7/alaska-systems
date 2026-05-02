const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

const Ticket = require('../models/ticketSchema');

module.exports = {
  customID: 'unclaimTicket',

  async execute(interaction) {

    try {
      const channel = interaction.channel;

      const ticket = await Ticket.findOne({ channelId: channel.id });
      if (!ticket) {
        return interaction.reply({
          content: 'Ticket not found in database.',
          ephemeral: true,
        });
      }

      if (ticket.claimedBy !== interaction.user.id) {
        return interaction.reply({
          content: `You can't unclaim a ticket you didn't claim.`,
          ephemeral: true,
        });
      }

      ticket.claimedBy = null;
      ticket.claimStatus = 'unclaimed';
      await ticket.save();

      const embed = new EmbedBuilder()
        .setDescription('This ticket has been unclaimed.')
        .setColor('#242429');

        const claimButton = new ButtonBuilder()
        .setCustomId('claimTicket')
        .setLabel('Claim')
        .setStyle(ButtonStyle.Secondary);
  
      const closeButton = new ButtonBuilder()
        .setCustomId('closeTicket')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(claimButton, closeButton);

      await interaction.update({
        components: [row],
      });

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error unclaiming ticket:', error);
      if (!interaction.replied) {
        await interaction.reply({
          content: 'An error occurred while unclaiming the ticket.',
          ephemeral: true,
        });
      }
    }
  },
};
