const {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  name: "support",
  cooldown: 5,
  async execute(message) {
    await message.delete()
    const requiredRoleId = "1498773946261045338"; // role id
    if (!message.guild.roles.cache.get(requiredRoleId)) {
      return message.reply({
        content: "The role set is currently invalid.",
      });
    }

    if (!message.member.roles.cache.has(requiredRoleId)) {
      return;
    }

    const imageEmbed = new EmbedBuilder()
      .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500187993464508658/image.png?ex=69f78671&is=69f634f1&hm=5a1b71a60124de51afbb01c94819faadcbe5394cf9eaf09f858278a08171eac4&=&format=webp&quality=lossless&width=1210&height=363')
      .setColor('#242429')

    const embed = new EmbedBuilder()
      .setColor("#242429")
      .setTitle('Assistance')
      .setDescription(`> Welcome to **<:alaskalogo112:1499028371479199909> Alaska State Roleplay**. If you have any questions, feel free to open a ticket and ask our helpful staff members. Please note that troll tickets, spamming tickets, and disrespect to our staff members will not be tolerated.`)
      .setFields(
        { name: 'General Ticket', value: '- Inquries\n- Claiming', inline: true },
        { name: 'Management Ticket', value: '- Reports\n- Manager Inquries', inline: true }
      )
      .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194')

    const dropdownMenu = new StringSelectMenuBuilder()
      .setCustomId("ticketDropdown")
      .setPlaceholder("Request Assistance")
      .addOptions([
        {
          label: "General Support",
          description: 'Open a general support ticket',
          value: 'general'
        },
        {
          label: "Management Support",
          description: 'Open a management support ticket',
          value: 'management'
        },
      ]);

    const row = new ActionRowBuilder().addComponents(dropdownMenu)
    try {
      await message.channel.send({
        embeds: [imageEmbed, embed],
        components: [row]
      });

    } catch (error) {
      console.error("Error sending ticket embed", error);
    }
  },
};