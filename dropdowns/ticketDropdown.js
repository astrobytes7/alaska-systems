const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const selectionMap = new Map();

module.exports = {
  customID: 'ticketDropdown',
  selectionMap,

  async execute(interaction) {
    const selectedValue = interaction.values[0];

    const modal = new ModalBuilder()
      .setCustomId('ticketModal')
      .setTitle(`${selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1)} Ticket Inquiry`);

    const inquiryInput = new TextInputBuilder()
      .setCustomId('inquiry')
      .setLabel('Inquiry')
      .setPlaceholder(`Why are you opening a ${selectedValue} ticket?`)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(inquiryInput);
    modal.addComponents(row);

    selectionMap.set(interaction.user.id, selectedValue);

    await interaction.showModal(modal);
  },
};
