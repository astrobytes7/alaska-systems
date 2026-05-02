const { EmbedBuilder } = require('discord.js');

module.exports = {
  customID: 'jurisdictionMap',

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#242429')
      .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500246551103017022/image.png?ex=69f7bcfb&is=69f66b7b&hm=bf44e895e2046ed5c71ed66ee2cb3f19f4a649de6099ec8629009eae2aa097e1&=&format=webp&quality=lossless&width=2321&height=1307'); // Placeholder map

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
