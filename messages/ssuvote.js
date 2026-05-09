const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const SsuVote = require("../models/ssuvoteSchema");

module.exports = {
    name: "ssuvote",
    description: 'ssu vote',

    async execute(message) {
        const requiredRoleId = "1497748722849681540"; // role id


        if (!message.guild.roles.cache.get(requiredRoleId)) {
            return message.reply({
                content: "The role set is currently invalid.",
            });
        }


        if (!message.member.roles.cache.has(requiredRoleId)) {
            return;
        }

        try {
            const amountRequired = '7' // amount required for votes
            const sessionChannelId = "1501938271998054451"; // channel id
            const sessionChannel = message.guild.channels.cache.get(sessionChannelId);

            if (!sessionChannel) {
                return message.reply({
                    content: "The session channel could not be found.",
                });
            }

            const voteData = await SsuVote.findOne({});

            const imageEmbed = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1500287703206596648/1500576853876936895/image.png?ex=69f8f099&is=69f79f19&hm=f094f0ee5f3c3864d79cf4096d2da3433b5bcdf5dcede29b85edb7a81ed98fed&=&format=webp&quality=lossless&width=1210&height=363")
                .setColor("#242429");

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle("Session Vote")
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(`An session vote has occured.\n\nWe need **${amountRequired}** votes`)
                .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f88f1d&is=69f73d9d&hm=ab9cbc2443b1cdeb354137bb09a7c43ad1dfbafa1effced6a5d404903e2393bb&=&format=webp&quality=lossless&width=2834&height=194')
                .setTimestamp();

            const button = new ButtonBuilder()
                .setLabel(`0/${amountRequired}`)
                .setCustomId("vote")
                .setStyle(ButtonStyle.Primary);

            const button2 = new ButtonBuilder()
                .setLabel("Votes")
                .setCustomId("votes")
                .setStyle(ButtonStyle.Secondary);

            const buttons = new ActionRowBuilder().addComponents(button, button2);

            const msg = await sessionChannel.send({
                content: `@here`,
                embeds: [imageEmbed, embed],
                components: [buttons]
            });

            await SsuVote.deleteMany({});
            await SsuVote.create({
                messageId: msg.id,
                channelId: sessionChannelId,
                amountRequired,
                amount: 0,
                voters: []
            });

        } catch (err) {
            console.error("Error starting session vote:", err);
            await message.reply({
                content: "There was an error starting the session vote.",
            });
        }
    }
};
