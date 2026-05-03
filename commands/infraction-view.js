const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Infraction = require('../models/infractionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infraction-view')
        .setDescription('View infractions by user or ID.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to view infractions for')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('infraction_id')
                .setDescription('Specific infraction ID to view')
                .setRequired(false)
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
            const infractionId = interaction.options.getString('infraction_id');

            if (infractionId) {
                const inf = await Infraction.findOne({ infractionId });
                if (!inf) {
                    return interaction.reply({
                        content: 'No infraction found with that ID.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#242429')
                    .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194')
                    .setTitle(`Infraction ${inf.infractionId}`)
                    .addFields(
                        { name: 'User', value: `<@${inf.userId}>`, inline: true },
                        { name: 'Infracter', value: `<@${inf.infracterId}>`, inline: true },
                        { name: 'Punishment', value: inf.punishment, inline: true },
                        { name: 'Reason', value: inf.reason, inline: true },
                        { name: 'Date', value: `<t:${Math.floor(inf.timestamp.getTime() / 1000)}:f>`, inline: true },
                        { name: 'Revoked', value: inf.revoked ? `Yes (<@${inf.revokerId}> )` : 'No', inline: true },
                    );

                return interaction.reply({ embeds: [embed] });
            }

            if (user) {
                const infractions = await Infraction.find({ userId: user.id });
                if (!infractions.length) {
                    return interaction.reply({
                        content: 'No infractions found for that user.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#242429')
                    .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194')
                    .setTitle(`Infractions for ${user.tag}`)
                    .setDescription(
                        infractions
                            .map(i => `**${i.infractionId}** — ${i.punishment} (${i.reason})`)
                            .join('\n')
                    );

                return interaction.reply({ embeds: [embed] });
            }

            return interaction.reply({
                content: 'Please provide either a user or an infraction ID.',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error fetching infractions:', error);
            await interaction.reply({
                content: 'Error fetching infractions.',
                ephemeral: true
            });
        }
    }
};
