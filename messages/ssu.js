const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require("discord.js");
const Session = require("../models/sessionSchema");
const { startSessionUpdater, updateSessionStatus } = require("../utils/SessionUpdater");
const { getServerData } = require("../utils/ErlcApi");

module.exports = {
    name: "ssu",
    description: "Issue a session startup.",

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

            const { name, ownerUsername, ownerId, joinKey, currentPlayers, maxPlayers, staffCount, queueCount } = await getServerData();

            const imageEmbed = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261519461679134/1.png?ex=6914870e&is=6913358e&hm=2e92cc4ab447b84e868934b8d3754b46fd26bc9190524d2b082a5aa4ce3b7cef&=&format=webp&quality=lossless&width=2576&height=764")
                .setColor("#242429");

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle("Session Startup")
                .setDescription(
                    "Our session is online"
                )
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp()
                .setImage('https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&')

            const button = new ButtonBuilder()
                .setLabel("Quick Join")
                .setStyle(ButtonStyle.Link)
                .setURL(`https://policeroleplay.community/join/${joinKey}`);

            const row = new ActionRowBuilder().addComponents(button);

            const sentMessage = await sessionChannel.send({
                content: `@here | <@&roleid>`,
                embeds: [imageEmbed, embed],
                components: [row],
            });

            let session = await Session.findOne({});
            if (!session) session = new Session({ status: "online" });

            session.status = "online";
            session.channelId2 = sessionChannel.id;
            session.messageId2 = sentMessage.id;
            await session.save();

            startSessionUpdater(client);
            await updateSessionStatus(client);
        } catch (err) {
            console.error("Error starting session startup:", err);
            await message.reply({
                content: "There was an error starting the session.",
                allowedMentions: { repliedUser: false },
            });
        }
    },
};