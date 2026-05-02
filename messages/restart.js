const axios = require('axios');

module.exports = {
    name: 'restart',
    description: 'Deploys the bot with new code via Dokploy webhook.',
    async execute(message, args) {
        const requiredRoleId = '1497748722849681540'; // role ID of who can use this command

        if (!message.member.roles.cache.has(requiredRoleId)) {
            return message.reply("You do not have permission to use this command.");
        }

        try {
            const statusMessage = await message.reply("🚀 **Restarting...** Triggering Dokploy deployment.");
            
            // Triggering the Dokploy webhook
            await axios.post('https://panel.noteshan.xyz/api/deploy/jrcM2oZk5dU61wP0KuJEE');
            
            await message.channel.send("✅ **Success!** Dokploy is now pulling the latest code and rebuilding the bot. It will be back online in a moment.");
        } catch (error) {
            console.error('Restart command error:', error);
            await message.reply("❌ **Error!** Failed to trigger Dokploy deployment. Make sure the webhook URL is still valid.");
        }
    },
};
