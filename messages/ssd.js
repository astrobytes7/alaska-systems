const { EmbedBuilder } = require("discord.js");
const Session = require("../models/sessionSchema");
const { stopSessionUpdater, updateSessionStatus } = require("../utils/SessionUpdater");

module.exports = {
    name: "ssd",
    description: "Issue a session shutdown.",

    async execute(message, args, client) {
        const requiredRoleId = "1497748722849681540"; // role id

        if (!message.guild.roles.cache.get(requiredRoleId)) {
            return message.reply({
                content: "The role set is currently invalid.",
            });
        }

        if (!message.member.roles.cache.has(requiredRoleId)) {
            return;
        }

        try {
            const sessionChannelId = ""; // channel id
            const sessionChannel = message.guild.channels.cache.get(sessionChannelId);

            if (!sessionChannel) {
                return message.reply({
                    content: "The session channel could not be found.",
                });
            }

            const imageEmbed = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261519461679134/1.png?ex=6914870e&is=6913358e&hm=2e92cc4ab447b84e868934b8d3754b46fd26bc9190524d2b082a5aa4ce3b7cef&=&format=webp&quality=lossless&width=2576&height=764")
                .setColor("#242429");

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle("Session Shutdown")
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(
                    "This server is shutdown"
                )
                .setImage('https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&')
                .setTimestamp();

            await sessionChannel.send({ embeds: [imageEmbed, embed] });

            let session = await Session.findOne({});
            if (!session) session = new Session();
            session.status = "offline";
            await session.save();

            stopSessionUpdater();
            await updateSessionStatus(client);

        } catch (err) {
            console.error("Error shutting down session:", err);
            await message.reply({
                content: "There was an error shutting down the session.",
            });
        }
    },
};
