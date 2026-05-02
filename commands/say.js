const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Says your message')
        .addStringOption(option => 
              option.setName('message')
              .setDescription('The message you want the bot to say.')
              .setRequired(true)),

    async execute(interaction) {
        const requiredRoleId = ''; // role id

        if (!interaction.guild.roles.cache.get(requiredRoleId)) {
            return interaction.reply({
                content: "The role set is currently invalid.",
            });
        }

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
            });
        }
          
        const message = interaction.options.getString('message');
        await interaction.reply({ content: `Your message has been sent!`, ephemeral: true });
        await interaction.channel.send({ content: message });
    },
};