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
      .setColor("#242429")
      .addFields(
        { name: "Total Members", value: totalMembers.toString(), inline: true },
        { name: "Online Members", value: onlineMembers.toString(), inline: true },
        { name: "Server Boosts", value: boostCount.toString(), inline: true }
      )

    await interaction.reply({ embeds: [embed] });
  },
};