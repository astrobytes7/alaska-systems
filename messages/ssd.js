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
            const sessionChannelId = "1497733145980698636"; // channel id
            const sessionChannel = message.guild.channels.cache.get(sessionChannelId);

            if (!sessionChannel) {
                return message.reply({
                    content: "The session channel could not be found.",
                });
            }

            const imageEmbed = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1400662781216296960/1500195923161255936/image.png?ex=69fad994&is=69f98814&hm=957f393e82537d77fd334cd4d4e5ff5f895a4a0c807ba13fa4564949c2ab07d7&=&format=webp&quality=lossless&width=2834&height=849")
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
                .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69fad91e&is=69f9879e&hm=db6d3bebbd8386b05430719a3a17683aefe97387dc193a71f5c048d6f26644eb&=&format=webp&quality=lossless&width=2834&height=194');

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
