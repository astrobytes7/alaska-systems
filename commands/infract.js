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
        const requiredRoleId = '1497748722849681540'; // role id

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
            const channelId = '1497733150946627753'; // channel id
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel) {
                return interaction.reply({
                    content: 'Could not find the infraction log channel.',
                    ephemeral: true
                });
            }

            const banner = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1400662781216296960/1500222803700486155/image.png?ex=69f7a6dd&is=69f6555d&hm=8532a9bd47a16f54d8c044ef1cd6aed5dbf431f7e9505ca06e83e2afa4bb3701&=&format=webp&quality=lossless&width=2834&height=849")
                .setColor('#242429');

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
                .setImage("https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194")
                .setFooter({ text: `Infraction ID: ${infractionId}` });

            const msg = await channel.send({
                content: `<@${user.id}>`,
                embeds: [banner, embed],
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
