const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Promotion = require('../models/promotionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promote')
        .setDescription('Record a promotion.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to promote')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName('new_rank')
                .setDescription('New rank of the user')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for promotion')
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
            const newRank = interaction.options.getRole('new_rank');
            const reason = interaction.options.getString('reason');
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const promotionId = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            const channelId = '1497733150946627752'; // channel id
            const channel = await interaction.guild.channels.fetch(channelId);

            if (!channel) {
                return interaction.reply({
                    content: 'Could not find the promotion log channel.',
                    ephemeral: true
                });
            }

            const banner = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1400662781216296960/1500223354295157007/image.png?ex=69f7a760&is=69f655e0&hm=ffe0534ef5d1b42c924d5428f031e63e3f3cafcdb57f9b57aa96686403e9b7ae&=&format=webp&quality=lossless&width=2834&height=849")
                .setColor('#242429');

            const embed = new EmbedBuilder()
                .setColor('#242429')
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTitle('Staff Promotion')
                .addFields(
                    { name: 'Staff', value: `${user}`, inline: true },
                    { name: 'New Rank', value: `${newRank}`, inline: true },
                    { name: 'Reason', value: `${reason}`, inline: false },
                )
                .setFooter({ text: `Promotion ID: ${promotionId}` });

            const msg = await channel.send({
                content: `<@${user.id}>`,
                embeds: [banner, embed],
            });

            await Promotion.create({
                promotionId,
                userId: user.id,
                messageId: msg.id,
                promoterId: interaction.user.id,
                newRankId: newRank.id,
                reason
            });

            await interaction.reply({
                content: 'Your promotion has been submitted!',
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
