const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Submit feedback about a staff member")
    .addUserOption(option =>
      option
        .setName("staff")
        .setDescription("The staff member you are giving feedback about")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("rating")
        .setDescription("Your rating from 1 to 5")
        .setRequired(true)
        .setChoices([
          { name: "1", value: "1" },
          { name: "2", value: "2" },
          { name: "3", value: "3" },
          { name: "4", value: "4" },
          { name: "5", value: "5" },
        ])
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("The reason for your rating")
        .setRequired(true)
    ),

  async execute(interaction) {
    const feedbackChannelId = ""; // channel id
    const feedbackChannel = interaction.guild.channels.cache.get(feedbackChannelId);

    if (!feedbackChannel) {
      return interaction.reply({
        content: "The feedback channel could not be found.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const staffMember = interaction.options.getUser("staff");
    const ratingValue = interaction.options.getString("rating");
    const reason = interaction.options.getString("reason");

    const customEmoji = "⭐"; // emoji for star
    const ratingDisplay = customEmoji.repeat(parseInt(ratingValue));

    const embed = new EmbedBuilder()
      .setColor("#242429")
      .setTitle("New Feedback")
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        { name: "Staff", value: `<@${staffMember.id}>`, inline: true },
        { name: "Rating", value: ratingDisplay, inline: true },
        { name: "Reason", value: reason, inline: false },
      )
      .setTimestamp()
      .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6914870f&is=6913358f&hm=ca3406181cba40825ab309d5a11407a070218d2fa38aaf424610d311ebe72ec6&=&format=webp&quality=lossless&width=2576&height=120")
      .setFooter({ text: "Feedback a staff yourself!" });

    await feedbackChannel.send({ embeds: [embed] });

    await interaction.reply({
      content: `Your feedback has been submitted successfully.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
