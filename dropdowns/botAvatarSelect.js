const path = require('path');
const fs = require('fs');

module.exports = {
    customID: 'botAvatarSelect',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const selectedValue = interaction.values[0];
        const profileMap = {
            'avatar_gold': 'goldlogo.png',
            'avatar_normal': 'standardnormallogo.png',
            'avatar_halloween': 'halloween logo.png',
            'avatar_breast_cancer': 'breastcancer.png',
            'avatar_christmas': 'christmas.png',
            'avatar_mental_health': 'mentalheath.png',
            'avatar_valentines': 'valentinesday.png'
        };

        const fileName = profileMap[selectedValue];
        if (!fileName) {
            return interaction.editReply({ content: "Invalid selection." });
        }

        const filePath = path.join(__dirname, '../profiles', fileName);

        if (!fs.existsSync(filePath)) {
            return interaction.editReply({ content: `File not found: ${fileName}` });
        }

        try {
            await interaction.client.user.setAvatar(filePath);
            await interaction.editReply({ content: `Successfully updated the bot avatar to **${selectedValue.replace('avatar_', '').replace('_', ' ')}**!` });
        } catch (error) {
            console.error("Error setting avatar:", error);
            await interaction.editReply({ content: `Failed to update avatar: ${error.message}` });
        }
    }
};
