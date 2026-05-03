const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  name: "regulations",
  async execute(message, args, client) {
    // Check for Administrator permissions
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("You need Administrator permissions to use this command.");
    }

    const targetChannelId = '1497733145808736451';
    const channel = await client.channels.fetch(targetChannelId).catch(() => null);

    if (!channel) {
      return message.reply("Target channel not found. Please ensure the ID is correct.");
    }

    // Delete the command message
    await message.delete().catch(() => { });

    // Banner Embed
    const bannerEmbed = new EmbedBuilder()
      .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500292656742535250/image.png?ex=69f7e7eb&is=69f6966b&hm=501e75ce3a86f981f70a95f8c892e35344dfc2cebe8d4de61500f9fb69dd49a1&=&format=webp&quality=lossless&width=1210&height=363')
      .setColor('#242429');

    // Main Regulations Embed
    const regEmbed = new EmbedBuilder()
      .setTitle('Alaska State Roleplay | Regulations')
      .setDescription(`> Welcome to the official **Regulations** page for **Alaska State Roleplay**. Please use the dropdown below to view specific categories of our rules and guidelines.`)
      .setColor('#242429')
      .setImage('https://cdn.discordapp.com/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a');

    // Dropdown Menu
    const regDropdown = new StringSelectMenuBuilder()
      .setCustomId('regulationsDropdown')
      .setDisabled(true)
      .setPlaceholder('Select a Regulation Category')
      .addOptions([
        {
          label: 'General Regulations',
          description: 'View our general community regulations',
          value: 'general_rules',
          emoji: '<:discord:1497811886539014235>'
        },
        {
          label: 'Game Regulations',
          description: 'View our game specific regulations',
          value: 'rp_rules',
          emoji: '<:Controller:1440193285611323474>'
        },
      ]);

    // Button
    const mapButton = new ButtonBuilder()
      .setCustomId('jurisdictionMap')
      .setLabel('Jurisdiction Map')
      .setStyle(ButtonStyle.Secondary)

    const row1 = new ActionRowBuilder().addComponents(regDropdown);
    const row2 = new ActionRowBuilder().addComponents(mapButton);

    try {
      await channel.send({
        embeds: [bannerEmbed, regEmbed],
        components: [row1, row2]
      });
    } catch (error) {
      console.error("Error sending regulations embed:", error);
      await message.channel.send("Failed to send the regulations embed.");
    }
  },
};
