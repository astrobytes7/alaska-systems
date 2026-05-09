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
            const sessionChannelId = "1501938271998054451"; // channel id
            const sessionChannel = message.guild.channels.cache.get(sessionChannelId);

            if (!sessionChannel) {
                return message.reply({
                    content: "The session channel could not be found.",
                });
            }

            const { name, ownerUsername, ownerId, joinKey, currentPlayers, maxPlayers, staffCount, queueCount } = await getServerData();

            const imageEmbed = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1500287703206596648/1500576853876936895/image.png?ex=69f8f099&is=69f79f19&hm=f094f0ee5f3c3864d79cf4096d2da3433b5bcdf5dcede29b85edb7a81ed98fed&=&format=webp&quality=lossless&width=2834&height=849")
                .setColor("#242429");

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle("Session Startup")
                .setDescription(
                    "The **<:alaskalogo112:1499028371479199909> Alaska State Roleplay** high rank team has decided to start a session. Please feel free to join our server by using code asrpp to join."
                )
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f88f1d&is=69f73d9d&hm=ab9cbc2443b1cdeb354137bb09a7c43ad1dfbafa1effced6a5d404903e2393bb&=&format=webp&quality=lossless&width=2834&height=194')

            const button = new ButtonBuilder()
                .setLabel("Quick Join")
                .setStyle(ButtonStyle.Link)
                .setURL(`https://policeroleplay.community/join/${joinKey}`);

            const row = new ActionRowBuilder().addComponents(button);

            const sentMessage = await sessionChannel.send({
                content: `@here`,
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