const axios = require("axios");

const ERLC_SERVER_TOKEN = "eGCMCiQBzvcdFpmkGfFg-QwGnOWzbJGJsydkWLjcHzSNZUDgwvoJJJewHOGVx"; // ERLC API KEY
const API_BASE = "https://api.policeroleplay.community/v1/server";

async function fetchFromAPI(endpoint = "") {
    try {
        const res = await axios.get(`${API_BASE}${endpoint}`, {
            headers: { "server-key": ERLC_SERVER_TOKEN },
        });
        return res.data;
    } catch (err) {
        console.error(`ERLC API Error (${endpoint || "/"}):`, err.response?.data || err.message);
        return null;
    }
}

async function getRobloxUsername(userId) {
    try {
        const res = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
        return res.data?.name || "Unknown";
    } catch (err) {
        console.error(`Roblox API Error (User ${userId}):`, err.response?.data || err.message);
        return "Unknown";
    }
}

async function getServerData() {
    const server = await fetchFromAPI("");
    const queue = await fetchFromAPI("/queue");
    const players = await fetchFromAPI("/players");

    const coOwnerIds = Array.isArray(server?.CoOwnerIds) ? server.CoOwnerIds : [];

    const ownerId = server?.OwnerId || null;
    const ownerUsername = ownerId ? await getRobloxUsername(ownerId) : "Unknown";

    let staffCount = 0;
    if (Array.isArray(players)) {
        const staffRoles = [
            "Server Owner",
            "Server Administrator",
            "Server Moderator"
        ];

        staffCount = players.filter(player => {
            const playerId = player.Player?.split(":")[1];
            const isCoOwner = coOwnerIds.includes(Number(playerId));
            const isStaffRole = staffRoles.includes(player.Permission);
            return isStaffRole || isCoOwner;
        }).length;
    }

    const queueCount = Array.isArray(queue) ? queue.length : 0;

    return {
        name: server?.Name || "Unknown",
        ownerId: ownerId || "N/A",
        ownerUsername,
        joinKey: server?.JoinKey || "N/A",
        currentPlayers: server?.CurrentPlayers ?? 0,
        maxPlayers: server?.MaxPlayers ?? 0,
        staffCount,
        queueCount,
    };
}

module.exports = { getServerData };
