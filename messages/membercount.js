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
      .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194')
      .addFields(
        { name: "Total Members", value: totalMembers.toString(), inline: true },
        { name: "Online Members", value: onlineMembers.toString(), inline: true },
        { name: "Server Boosts", value: boostCount.toString(), inline: true }
      );

    await message.channel.send({ embeds: [embed] });
  },
};