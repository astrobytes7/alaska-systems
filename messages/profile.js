const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: "profile",
    description: "Select the bot's profile avatar.",
    async execute(message, args, client) {
        // Permissions check: Only administrators can change profile settings
        if (!message.member.permissions.has('Administrator')) {
            return message.reply("You need Administrator permissions to use this command.");
        }

        const embed = new EmbedBuilder()
            .setTitle('Bot Profile Management')
            .setDescription('Select an avatar option from the dropdown below to change the bot\'s profile picture. Note: Some options may be seasonal.')
            .setColor('#242429')
            .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f88f1d&is=69f73d9d&hm=ab9cbc2443b1cdeb354137bb09a7c43ad1dfbafa1effced6a5d404903e2393bb&=&format=webp&quality=lossless&width=2834&height=194');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('botAvatarSelect')
            .setPlaceholder('Select bot avatar...')
            .addOptions([
                {
                    label: 'Gold Avatar',
                    description: 'Set the bot profile to the Gold variant.',
                    value: 'avatar_gold',
                },
                {
                    label: 'Normal Avatar',
                    description: 'Set the bot profile back to the standard logo.',
                    value: 'avatar_normal',
                },
                {
                    label: 'Halloween Avatar',
                    description: 'Set the bot profile to the spooky Halloween variant.',
                    value: 'avatar_halloween',
                },
                {
                    label: 'Breast Cancer Awareness',
                    description: 'Set the bot profile to the pink awareness variant.',
                    value: 'avatar_breast_cancer',
                },
                {
                    label: 'Christmas Avatar',
                    description: 'Set the bot profile to the festive Christmas variant.',
                    value: 'avatar_christmas',
                },
                {
                    label: 'Mental Health Awareness',
                    description: 'Set the bot profile to the green awareness variant.',
                    value: 'avatar_mental_health',
                },
                {
                    label: 'Valentines Day',
                    description: 'Set the bot profile to the romantic Valentines variant.',
                    value: 'avatar_valentines',
                },
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await message.reply({
            embeds: [embed],
            components: [row],
        });

        // Delete the original command message to keep the channel clean
        await message.delete().catch(() => { });
    }
};
