const { EmbedBuilder } = require('discord.js');

module.exports = {
  customID: 'regulationsDropdown',

  async execute(interaction) {
    const selectedValue = interaction.values[0];
    
    const embed = new EmbedBuilder()
      .setColor('#242429')
      .setTimestamp();

    switch (selectedValue) {
      case 'general_rules':
        embed.setTitle('📋 General Rules')
          .setDescription('> 1. Be respectful to all members.\n> 2. No toxicity or harassment.\n> 3. Follow all Discord Terms of Service.');
        break;
      case 'rp_rules':
        embed.setTitle('🎭 Roleplay Rules')
          .setDescription('> 1. No FailRP.\n> 2. No RDM/VDM.\n> 3. Always value your life (FearRP).');
        break;
      case 'staff_rules':
        embed.setTitle('🛡️ Staff Guidelines')
          .setDescription('> 1. Maintain professionalism at all times.\n> 2. Do not abuse permissions.\n> 3. Always provide proof for punishments.');
        break;
      default:
        return interaction.reply({ content: 'Invalid selection.', ephemeral: true });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
