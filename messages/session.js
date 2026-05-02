const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Session = require("../models/sessionSchema");
const { getServerData } = require("../utils/ErlcApi"); // Update ERLC Api in utils folder and ErlcApi file.

module.exports = {
    name: "session",
    async execute(message, args, client) {
        const requiredRoleId = ""; // role id
        
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
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261519461679134/1.png?ex=6914870e&is=6913358e&hm=2e92cc4ab447b84e868934b8d3754b46fd26bc9190524d2b082a5aa4ce3b7cef&=&format=webp&quality=lossless&width=2576&height=764");

            const mainEmbed = new EmbedBuilder()
                .setColor('#242429')
                .setDescription(
                    `## Session Embed\n> Your session embed description!\n\n* Server Name: ${name}\n* Server Code: ${joinKey}\n* Server Owner: ${ownerUsername}`)
                .setImage('https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&'); 

            const playerEmbed = new EmbedBuilder()
                .setDescription(`## In-Game Status\n\n**Last Updated:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                .setColor("#242429")
                .addFields(
                    { name: "Player Count", value: `\`\`\`${currentPlayers}/${maxPlayers}\`\`\``, inline: true },
                    { name: "Active Staff", value: `\`\`\`${staffCount}\`\`\``, inline: true },
                    { name: "In Queue", value: `\`\`\`${queueCount}\`\`\``, inline: true }
                )
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6914870f&is=6913358f&hm=ca3406181cba40825ab309d5a11407a070218d2fa38aaf424610d311ebe72ec6&=&format=webp&quality=lossless&width=2576&height=120")
            
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
