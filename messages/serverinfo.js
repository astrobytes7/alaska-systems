const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "serverinfo",

    async execute(message, args, client) {
        try {

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle("server information")
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(
                    "This is a good server"
                )
                .setImage('https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&')
                .setTimestamp();

            await message.channel.send({ embeds: [ embed] });

        } catch (err) {
            console.error("Error sending serverinfo:", err);
            await message.reply({
                content: `There was an error sending server info.`,
            });
        }
    },
};
