module.exports = {
    customID: 'botAvatarSelect',
    async execute(interaction) {
        // Currently doing nothing as per user request
        await interaction.reply({
            content: "Avatar selection logic is coming soon!",
            ephemeral: true
        });
    }
};
