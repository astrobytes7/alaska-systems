const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Session = require("../models/sessionSchema");
const { getServerData } = require("./ErlcApi");

// The channel that MUST always contain the session embed.
const SESSION_CHANNEL_ID = "1497733145980698636";

let guardInterval = null;  // runs every 1 second – checks if the embed still exists
let statsInterval = null;  // runs every 60 seconds – refreshes ERLC player counts

// ─────────────────────────────────────────────────────────────────────────────
// Helpers to build the embeds / components (shared by send & edit paths)
// ─────────────────────────────────────────────────────────────────────────────
function buildEmbeds(session, erlcData) {
    const { name, ownerUsername, joinKey, currentPlayers, maxPlayers, staffCount, queueCount } =
        erlcData || { name: "N/A", ownerUsername: "N/A", joinKey: "N/A", currentPlayers: 0, maxPlayers: 0, staffCount: 0, queueCount: 0 };

    const imageEmbed = new EmbedBuilder()
        .setColor("#242429")
        .setImage(
            "https://media.discordapp.net/attachments/1400662781216296960/1500195923161255936/image.png?ex=69f78dd4&is=69f63c54&hm=2837c6db7be3713d0a5843a3304327b383130a133625e1c3c93a2f37955ad700&=&format=webp&quality=lossless&width=1210&height=363"
        );

    const mainEmbed = new EmbedBuilder()
        .setColor("#242429")
        .setDescription(
            `## Session Embed\n> Thank you for choosing **<:alaskalogo112:1499028371479199909> Alaska State Roleplay**. In this informational embed you can view our live server stats, and server information. If you require assistance please feel free to open a ticket in our assistance channel. \n\n* Server Name: ${name}\n* Server Code: ${joinKey}\n* Server Owner: ${ownerUsername}`
        )
        .setImage(
            "https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&"
        );

    const playerEmbed = new EmbedBuilder()
        .setDescription(`## In-Game Status\n\n**Last Updated:** <t:${Math.floor(Date.now() / 1000)}:R>`)
        .setColor("#242429")
        .addFields(
            { name: "Player Count", value: `\`\`\`${currentPlayers}/${maxPlayers}\`\`\``, inline: true },
            { name: "Active Staff", value: `\`\`\`${staffCount}\`\`\``, inline: true },
            { name: "In Queue", value: `\`\`\`${queueCount}\`\`\``, inline: true }
        )
        .setImage(
            "https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194"
        );

    return [imageEmbed, mainEmbed, playerEmbed];
}

function buildRow(session) {
    const roleButton = new ButtonBuilder()
        .setCustomId("sessionRole")
        .setLabel("Session Role")
        .setDisabled(false)
        .setStyle(ButtonStyle.Secondary);

    const statusButton = new ButtonBuilder()
        .setCustomId("session_status")
        .setLabel(session.status === "online" ? "Session Online" : "Session Offline")
        .setDisabled(true)
        .setStyle(session.status === "online" ? ButtonStyle.Success : ButtonStyle.Danger);

    return new ActionRowBuilder().addComponents(roleButton, statusButton);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache latest ERLC data so we can resend the embed even between stat refreshes
// ─────────────────────────────────────────────────────────────────────────────
let cachedErlcData = null;

// ─────────────────────────────────────────────────────────────────────────────
// Guard: checks every second if the embed message still exists.
// If it's gone → resend it to SESSION_CHANNEL_ID and save the new message ID.
// ─────────────────────────────────────────────────────────────────────────────
async function guardSession(client) {
    try {
        const session = await Session.findOne({});
        if (!session || !session.messageId) return; // No active session – nothing to guard

        // Always enforce the hardcoded channel
        const channelId = SESSION_CHANNEL_ID;
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel) return;

        const message = await channel.messages.fetch(session.messageId).catch(() => null);

        if (!message) {
            // ── Embed was deleted – resend it ──────────────────────────────
            console.log("[SessionGuard] Session embed was deleted – resending...");

            const embeds = buildEmbeds(session, cachedErlcData);
            const row = buildRow(session);

            const newMessage = await channel.send({ embeds, components: [row] });

            session.messageId = newMessage.id;
            session.channelId = channelId;
            await session.save();

            console.log(`[SessionGuard] Embed resent. New message ID: ${newMessage.id}`);
        }
    } catch (err) {
        console.error("[SessionGuard] Error during guard check:", err.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats refresh: edits the existing embed with fresh ERLC data (every 60 s)
// ─────────────────────────────────────────────────────────────────────────────
async function updateSessionStatus(client) {
    try {
        const session = await Session.findOne({});
        if (!session || !session.messageId) return;

        // Fetch fresh ERLC stats
        try {
            cachedErlcData = await getServerData();
        } catch (err) {
            console.warn("[SessionUpdater] Could not fetch ERLC stats:", err.message);
        }

        const channelId = SESSION_CHANNEL_ID;
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel) return;

        const message = await channel.messages.fetch(session.messageId).catch(() => null);
        if (!message) return; // guard will resend it shortly

        const embeds = buildEmbeds(session, cachedErlcData);
        const row = buildRow(session);

        await message.edit({ embeds, components: [row] });
    } catch (err) {
        console.error("[SessionUpdater] Error updating session status:", err.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Start / Stop
// ─────────────────────────────────────────────────────────────────────────────
function startSessionUpdater(client) {
    stopSessionUpdater();

    // Existence check every 1 second
    guardInterval = setInterval(() => guardSession(client), 1000);

    // Stats refresh every 60 seconds
    statsInterval = setInterval(() => updateSessionStatus(client), 60 * 1000);

    // Run an immediate stats update so the embed is fresh on startup
    updateSessionStatus(client);
}

function stopSessionUpdater() {
    if (guardInterval) { clearInterval(guardInterval); guardInterval = null; }
    if (statsInterval) { clearInterval(statsInterval); statsInterval = null; }
}

module.exports = { startSessionUpdater, stopSessionUpdater, updateSessionStatus };
