const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Sends information on total membercount, online members and server boosts."),

  async execute(interaction) {
    const { guild } = interaction;

    await guild.members.fetch();

    const totalMembers = guild.memberCount;

    const onlineMembers = guild.members.cache.filter(
      (member) => member.presence && member.presence.status !== "offline"
    ).size;

    const boostCount = guild.premiumSubscriptionCount || 0;

    const embed = new EmbedBuilder()
      .setTitle("Member Count")
      .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194')
      .setColor("#242429")
      .addFields(
        { name: "Total Members", value: totalMembers.toString(), inline: true },
        { name: "Online Members", value: onlineMembers.toString(), inline: true },
        { name: "Server Boosts", value: boostCount.toString(), inline: true }
      )

    await interaction.reply({ embeds: [embed] });
  },
};