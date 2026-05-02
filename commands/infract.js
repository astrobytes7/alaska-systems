const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Infraction = require('../models/infractionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infract')
        .setDescription('Record an infraction.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to punish')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('punishment')
                .setDescription('Type of punishment')
                .setRequired(true)
                .addChoices(
                    { name: 'Warning', value: 'Warning' },
                    { name: 'Strike 1', value: 'Strike 1' },
                    { name: 'Strike 2', value: 'Strike 2' },
                    { name: 'Strike 3', value: 'Strike 3' },
                    { name: 'Suspension', value: 'Suspension' },
                    { name: 'Termination', value: 'Termination' },
                )
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for infraction')
                .setRequired(true)
        ),

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

        try {
            const user = interaction.options.getUser('user');
            const punishment = interaction.options.getString('punishment');
            const reason = interaction.options.getString('reason');
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const infractionId = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            const channelId = ''; // channel id
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Could not find the infraction log channel.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#242429')
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTitle('Staff Infraction')
                .addFields(
                    { name: 'Staff', value: `${user}`, inline: true },
                    { name: 'Punishment', value: `${punishment}`, inline: true },
                    { name: 'Reason', value: `${reason}`, inline: false },
                )
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6914870f&is=6913358f&hm=ca3406181cba40825ab309d5a11407a070218d2fa38aaf424610d311ebe72ec6&=&format=webp&quality=lossless&width=2576&height=120")
                .setFooter({ text: `Infraction ID: ${infractionId}` });

            const msg = await channel.send({
                content: `<@${user.id}>`,
                embeds: [embed],
            });

            await Infraction.create({
                infractionId,
                userId: user.id,
                messageId: msg.id,
                infracterId: interaction.user.id,
                punishment,
                reason
            });

            await interaction.reply({
                content: 'Your infraction has been submitted!',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({
                content: 'There was an error executing the command!',
                ephemeral: true
            });
        }
    }
};
