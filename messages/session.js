const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Session = require("../models/sessionSchema");
const { getServerData } = require("../utils/ErlcApi"); // Update ERLC Api in utils folder and ErlcApi file.

module.exports = {
    name: "session",
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

            let session = await Session.findOne({});
            if (!session) {
                session = new Session();
            }
            session.status = "offline";
            await session.save();

            const { name, ownerUsername, ownerId, joinKey, currentPlayers, maxPlayers, staffCount, queueCount } = await getServerData();

            const imageEmbed = new EmbedBuilder()
                .setColor("#242429")
                .setImage("https://media.discordapp.net/attachments/1400662781216296960/1500195923161255936/image.png?ex=69f78dd4&is=69f63c54&hm=2837c6db7be3713d0a5843a3304327b383130a133625e1c3c93a2f37955ad700&=&format=webp&quality=lossless&width=1210&height=363");

            const mainEmbed = new EmbedBuilder()
                .setColor('#242429')
                .setDescription(
                    `## Session Embed\n> Thank you for choosing **<:alaskalogo112:1499028371479199909> Alaska State Roleplay**. In this informational embed you van view our live server stats, and server information. If you require assistance please feel free to open a ticket in our assistance channel. \n\n* Server Name: ${name}\n* Server Code: ${joinKey}\n* Server Owner: ${ownerUsername}`)
                .setImage('https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&');

            const playerEmbed = new EmbedBuilder()
                .setDescription(`## In-Game Status\n\n**Last Updated:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                .setColor("#242429")
                .addFields(
                    { name: "Player Count", value: `\`\`\`${currentPlayers}/${maxPlayers}\`\`\``, inline: true },
                    { name: "Active Staff", value: `\`\`\`${staffCount}\`\`\``, inline: true },
                    { name: "In Queue", value: `\`\`\`${queueCount}\`\`\``, inline: true }
                )
                .setImage("https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194")

            const roleButton = new ButtonBuilder()
                .setCustomId("sessionRole")
                .setLabel('Session Role')
                .setDisabled(false)
                .setStyle(ButtonStyle.Secondary);

            const statusButton = new ButtonBuilder()
                .setCustomId("session_status")
                .setLabel(session.status === "online" ? "Session Online" : "Session Offline")
                .setDisabled(true)
                .setStyle(session.status === "online" ? ButtonStyle.Success : ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(roleButton, statusButton);

            const embedMessage = await message.channel.send({
                embeds: [imageEmbed, mainEmbed, playerEmbed],
                components: [row],
            });

            session.messageId = embedMessage.id;
            session.channelId = message.channel.id;
            await session.save();

        } catch (error) {
            console.error(error.response?.data || error.message);
            await message.channel.send("There was an error sending this embed");
        }
    },
};
