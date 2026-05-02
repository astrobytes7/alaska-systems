const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Session = require("../models/sessionSchema");
const { getServerData } = require("./ErlcApi");

let updaterInterval = null;

async function updateSessionStatus(client) {
    try {
        const session = await Session.findOne({});
        if (!session || !session.messageId || !session.channelId) return;

        const channel = await client.channels.fetch(session.channelId).catch(() => null);
        if (!channel) return;

        const message = await channel.messages.fetch(session.messageId).catch(() => null);
        if (!message) return;

        let playerEmbed;
        let statusButton;

        let currentPlayers = 0, maxPlayers = 0, staffCount = 0, queueCount = 0;
        try {
            const data = await getServerData();
            currentPlayers = data.currentPlayers;
            maxPlayers = data.maxPlayers;
            staffCount = data.staffCount;
            queueCount = data.queueCount;
        } catch (err) {
            console.warn("Could not fetch ERLC stats:", err.message);
        }

        if (session.status === "online") {
            playerEmbed = new EmbedBuilder()
                .setDescription(`## In-Game Status\n\n**Last Updated:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                .setColor("#242429")
                .addFields(
                    { name: "Player Count", value: `\`\`\`${currentPlayers}/${maxPlayers}\`\`\``, inline: true },
                    { name: "Active Staff", value: `\`\`\`${staffCount}\`\`\``, inline: true },
                    { name: "In Queue", value: `\`\`\`${queueCount}\`\`\``, inline: true }
                )
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6914870f&is=6913358f&hm=ca3406181cba40825ab309d5a11407a070218d2fa38aaf424610d311ebe72ec6&=&format=webp&quality=lossless&width=2576&height=120");

            statusButton = new ButtonBuilder()
                .setCustomId("session_status")
                .setLabel("Session Online")
                .setDisabled(true)
                .setStyle(ButtonStyle.Success);
        } else {
            playerEmbed = new EmbedBuilder()
                .setDescription(`## In-Game Status\n\n**Last Updated:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                .setColor("#242429")
                .addFields(
                    { name: "Player Count", value: `\`\`\`${currentPlayers}/${maxPlayers}\`\`\``, inline: true },
                    { name: "Active Staff", value: `\`\`\`${staffCount}\`\`\``, inline: true },
                    { name: "In Queue", value: `\`\`\`${queueCount}\`\`\``, inline: true }
                )
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6914870f&is=6913358f&hm=ca3406181cba40825ab309d5a11407a070218d2fa38aaf424610d311ebe72ec6&=&format=webp&quality=lossless&width=2576&height=120");

            statusButton = new ButtonBuilder()
                .setCustomId("session_status")
                .setLabel("Session Offline")
                .setDisabled(true)
                .setStyle(ButtonStyle.Danger);
        }

        const roleButton = new ButtonBuilder()
            .setCustomId("sessionRole")
            .setLabel("Session Role")
            .setDisabled(false)
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(roleButton, statusButton);

        const embeds = [
            message.embeds[0] ? EmbedBuilder.from(message.embeds[0]) : null,
            message.embeds[1] ? EmbedBuilder.from(message.embeds[1]) : null,
            playerEmbed
        ].filter(Boolean);

        await message.edit({
            embeds,
            components: [row],
        });
    } catch (err) {
        console.error("Error in session updater:", err);
    }
}

function startSessionUpdater(client) {
    if (updaterInterval) clearInterval(updaterInterval);
    updaterInterval = setInterval(() => updateSessionStatus(client), 60 * 1000);
}

function stopSessionUpdater() {
    if (updaterInterval) {
        clearInterval(updaterInterval);
        updaterInterval = null;
    }
}

module.exports = { startSessionUpdater, stopSessionUpdater, updateSessionStatus };
