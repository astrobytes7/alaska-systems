const { MessageFlags } = require("discord.js");

module.exports = {
    customID: "sessionRole",

    async execute(interaction) {
        try {
            const roleId = ""; // role id
            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return await interaction.reply({
                    content: "Could not find the session role.",
                    flags: MessageFlags.Ephemeral,
                });
            }

            const member = interaction.member;

            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(roleId);
                await interaction.reply({
                    content: `Removed the **${role.name}** role from you.`,
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await member.roles.add(roleId);
                await interaction.reply({
                    content: `You have been given the **${role.name}** role.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        } catch (err) {
            console.error("Error toggling session role:", err);
            await interaction.reply({
                content: "Something went wrong while updating your role.",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
