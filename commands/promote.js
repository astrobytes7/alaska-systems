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
                .setImage("https://media.discordapp.net/attachments/1500287703206596648/1500293233320656906/image.png?ex=69f7e874&is=69f696f4&hm=fa943c70f354591a844e3ac06830d7c15c7ccd474bea45efe8730ab9efd7f667&=&format=webp&quality=lossless&width=1210&height=363")
                .setColor('#242429');

            const embed = new EmbedBuilder()
                .setColor('#242429')
                .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194')
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
