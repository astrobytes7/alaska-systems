const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const DiscordTranscripts = require('discord-html-transcripts');
const Ticket = require('../models/ticketSchema');
const fs = require('fs');
const path = require('path');
const { closeTicket } = require('../utils/TicketActions');

module.exports = {
  customID: 'closeTicket',

  async execute(interaction) {
    const transcriptChannelId = '1500199554786525254'; // channel id
    const requiredRoleId = '1497749785812140086'; // role id

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

    const channel = interaction.channel;
    const closer = interaction.user;

    try {
      await interaction.deferReply().catch(() => { });

      await closeTicket(channel, closer, interaction.client);

      await interaction.editReply({
        content: 'Ticket closed successfully.',
      }).catch(() => { });

    } catch (error) {
      console.error('Error closing ticket:', error);
      // ... error handling already handled in utility or here
    }
  },
};
