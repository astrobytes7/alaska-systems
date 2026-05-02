const {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  name: "ticket",
  cooldown: 5,
  async execute(message) {
    await message.delete()
    const requiredRoleId = ""; // role id
            if (!message.guild.roles.cache.get(requiredRoleId)) {
            return message.reply({
                content: "The role set is currently invalid.",
            });
        }
        
    if (!message.member.roles.cache.has(requiredRoleId)) {
        return;
    } 

    const imageEmbed = new EmbedBuilder()
      .setImage('https://media.discordapp.net/attachments/1433261489879519302/1433261519461679134/1.png?ex=6913de4e&is=69128cce&hm=6da0bd5ed1363a6eed036ccfa3d99955053bebcc235655fb5447aaf7163cce10&=&format=webp&quality=lossless&width=2576&height=764')
      .setColor('#242429')

    const embed = new EmbedBuilder()
      .setColor("#242429")
      .setTitle('Your Title')
      .setDescription(`Your Description`)
      .setFields(
        { name: 'General Ticket', value: 'Supports\nSupports\nSupports', inline: true },
        { name: 'Management Ticket', value: 'Supports\nSupports\nSupports', inline: true }
      )
      .setImage('https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6913de4f&is=69128ccf&hm=a0d23fe0915dfaedff9c09793a183a97db72c85569dd2f261b9f7ecd56832044&=&format=webp&quality=lossless&width=2576&height=120')

    const dropdownMenu = new StringSelectMenuBuilder()
      .setCustomId("ticketDropdown")
      .setPlaceholder("request assistance")
      .addOptions([
        {
          label: "general",
          description: 'general ticket',
          value: 'general'
        },
        {
          label: "management",
          description: 'management ticket',
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