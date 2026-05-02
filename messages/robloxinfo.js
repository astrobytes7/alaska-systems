const { getRobloxInfo } = require("../utils/docksystem.js");

module.exports = {
    name: "id",
    description: "Get the ID of your Roblox and Discord account!",
    cooldown: 5,
    execute: async function (message, client, args) {
        if (message.author.bot) return;
        if (!message.guild) return;

        const discordId = message.author.id;

        try {
            const loadingMessage = await message.reply(
                "<a:loading:1426274912691028178> Fetching id's...",
            );

            await new Promise((resolve) => setTimeout(resolve, 500));

            const result = await getRobloxInfo(discordId, message, client);

            if (result.error) {
                return await loadingMessage.edit(
                    `**Your Discord ID:** \`${discordId}\`\nError: ${result.error}`,
                );
            }

            await loadingMessage.edit(
                `**Your Discord ID:** \`${discordId}\`\n**Your Roblox ID:** \`${result.robloxId}\``,
            );
        } catch (error) {
            console.error(error);
            await message.reply(
                "Error fetching your IDs. This could be because you're not linked with [DockSystems](https://docksystems.xyz).",
            );
        }
    },
};