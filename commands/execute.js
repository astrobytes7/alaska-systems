const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("execute")
        .setDescription("Execute an ER:LC server command")
        .addStringOption(option =>
            option
                .setName("command")
                .setDescription("Command to run (ex: :h Hello)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const allowedRoleIds = [
            "1478512703193485414",
            "1478512709812224244",
            "1478512714752983052"
        ];

        const hasAllowedRole = interaction.member.roles.cache.some(role =>
            allowedRoleIds.includes(role.id)
        );

        if (!hasAllowedRole) {
            return interaction.reply({
                content: "You don't have permission to use this command.",
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const command = interaction.options.getString("command", true);

            await axios.post(
                "https://api.policeroleplay.community/v1/server/command",
                {
                    command: command
                },
                {
                    headers: {
                        "server-key": "",
                        "Content-Type": "application/json"
                    }
                }
            );

            await interaction.editReply(`Executed: \`${command}\``);

        } catch (err) {
            console.error("execute error:", err.response?.status, err.response?.data || err.message);

            if (err.response?.status === 403) {
                return interaction.editReply("Invalid server key or no permission.");
            }

            if (err.response?.status === 400) {
                return interaction.editReply("Invalid command format.");
            }

            await interaction.editReply("Failed to execute command.");
        }
    }
};