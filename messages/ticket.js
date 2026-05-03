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
      .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500292434738024468/image.png?ex=69f7e7b6&is=69f69636&hm=ae91837cb6814f209e3c66cbff1048ebfe382f923032053e025b3a9138fda1ab&=&format=webp&quality=lossless&width=2834&height=849')
      .setColor('#242429')

    const embed = new EmbedBuilder()
      .setColor("#242429")
      .setTitle('Assistance')
      .setDescription(`> Welcome to **<:alaskalogo112:1499028371479199909> Alaska State Roleplay**. If you have any questions, feel free to open a ticket and ask our helpful staff members. Please note that troll tickets, spamming tickets, and disrespect to our staff members will not be tolerated.`)
      .setFields(
        { name: 'General Ticket', value: '- Inquries\n- Claiming', inline: true },
        { name: 'Management Ticket', value: '- Reports\n- Manager Inquries', inline: true }
      )
      .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194')

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