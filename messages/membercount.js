const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "Sends information on total membercount, online members and server boosts.",
  aliases: ["mc", "members"],
  async execute(message, args, client) {
    const { guild } = message;

    const totalMembers = guild.memberCount;

    const onlineMembers = guild.members.cache.filter(
      (member) => member.presence && member.presence.status !== "offline"
    ).size;

    const boostCount = guild.premiumSubscriptionCount || 0;

    const embed = new EmbedBuilder()
      .setTitle("Membercount")
      .setColor("#242429")
      .addFields(
        { name: "Total Members", value: totalMembers.toString(), inline: true },
        { name: "Online Members", value: onlineMembers.toString(), inline: true },
        { name: "Server Boosts", value: boostCount.toString(), inline: true }
      );

    await message.channel.send({ embeds: [embed] });
  },
};