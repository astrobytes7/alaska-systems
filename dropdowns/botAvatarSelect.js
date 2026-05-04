const path = require('path');
const fs = require('fs');

module.exports = {
    customID: 'botAvatarSelect',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const selectedValue = interaction.values[0];
        const profileMap = {
            'avatar_gold': { file: 'goldlogo.png', primary: 0xFFD700, secondary: 0xFFAA00 },
            'avatar_normal': { file: 'standardnormallogo.png', primary: 0x242429, secondary: 0x4A4A4F },
            'avatar_halloween': { file: 'halloween logo.png', primary: 0xFF8C00, secondary: 0x000000 },
            'avatar_breast_cancer': { file: 'breastcancer.png', primary: 0xFF69B4, secondary: 0xFFB6C1 },
            'avatar_christmas': { file: 'christmas.png', primary: 0xFF0000, secondary: 0x00FF00 },
            'avatar_mental_health': { file: 'mentalheath.png', primary: 0x00FF00, secondary: 0xADFF2F },
            'avatar_valentines': { file: 'valentinesday.png', primary: 0xFF0000, secondary: 0xFF69B4 }
        };

        const config = profileMap[selectedValue];
        if (!config) {
            return interaction.editReply({ content: "Invalid selection." });
        }

        const fileName = config.file;
        const filePath = path.join(__dirname, '../profiles', fileName);

        if (!fs.existsSync(filePath)) {
            return interaction.editReply({ content: `File not found: ${fileName}` });
        }

        try {
            // 1. Update Role Gradient FIRST (higher rate limit)
            const roleId = '1499184609131368539';
            const role = await interaction.guild.roles.fetch(roleId);
            if (role) {
                console.log(`Attempting to update role ${roleId} colors to:`, config.primary, config.secondary);
                await role.edit({
                    primaryColor: config.primary,
                    secondaryColor: config.secondary
                });
                console.log("Role update request sent successfully.");
            } else {
                console.error("Role not found!");
            }

            // 2. Update Bot Avatar (lower rate limit)
            let avatarSuccess = true;
            await interaction.client.user.setAvatar(filePath).catch(err => {
                console.error("Avatar Update Error (Likely Rate Limit):", err.message);
                avatarSuccess = false;
            });

            let responseMessage = `Successfully updated the **Role Gradient** to match the theme!`;
            if (avatarSuccess) {
                responseMessage += `\nBot avatar updated successfully.`;
            } else {
                responseMessage += `\n**Note:** Avatar could not be updated due to Discord's rate limit (2 changes per hour). Please wait and try again later.`;
            }

            await interaction.editReply({ content: responseMessage });
        } catch (error) {
            console.error("Error setting avatar:", error);
            await interaction.editReply({ content: `Failed to update avatar: ${error.message}` });
        }
    }
};
