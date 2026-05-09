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
      .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500247369277771998/image.png?ex=69f7bdbe&is=69f66c3e&hm=9d00bef9fceb67ac0bac93f94bbbfa3ba4056cfe71069c5de8a6cac2eab6b8dd&=&format=webp&quality=lossless&width=1210&height=363')
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

    const voiceRules = new ButtonBuilder()
      .setLabel('Roblox Group')
      .setStyle(ButtonStyle.Link)
      .setURL('https://www.roblox.com/communities/779761993/Elevate-26-Community#!/about')

    const staff = new ButtonBuilder()
      .setLabel('Staff Application')
      .setStyle(ButtonStyle.Link)
      .setURL('https://melon.ly/form/7405300452419440640')

    const row1 = new ActionRowBuilder().addComponents(regDropdown);
    const row2 = new ActionRowBuilder().addComponents(mapButton, staff, voiceRules);

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
