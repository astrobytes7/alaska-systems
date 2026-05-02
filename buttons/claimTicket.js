const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const Ticket = require('../models/ticketSchema');

module.exports = {
  customID: 'claimTicket',

  async execute(interaction) {
    const requiredRoleId = '1497748354136936609'; // role id

    if (!interaction.guild.roles.cache.get(requiredRoleId)) {
      return intercation.reply({
        content: "The role set is currently invalid.",
      });
    }

    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply({
        content: 'You do not have permission to use this button.',
      });
    }

    try {
      const user = interaction.user;
      const channel = interaction.channel;

      const ticket = await Ticket.findOneAndUpdate(
        { channelId: channel.id },
        { claimedBy: user.id },
        { claimStatus: 'claimed' },
      );

      if (!ticket) {
        return await interaction.reply({
          content: 'Ticket not found in the database.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setDescription(`This ticket has been claimed by <@${user.id}>.`)
        .setColor('#242429');

      const unclaimButton = new ButtonBuilder()
        .setCustomId('unclaimTicket')
        .setLabel('Unclaim')
        .setStyle(ButtonStyle.Secondary);

      const closeButton = new ButtonBuilder()
        .setCustomId('closeTicket')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(
        unclaimButton,
        closeButton,
      );

      await interaction.update({
        components: [row],
      });

      await channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Error claiming ticket:', error);
      if (!interaction.replied) {
        await interaction.reply({
          content: 'An error occurred while claiming the ticket.',
          ephemeral: true,
        });
      }
    }
  },
};
