const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const SsuVote = require("../models/ssuvoteSchema");

module.exports = {
    name: "ssuvote",
    description: 'ssu vote',

    async execute(message) {
        const requiredRoleId = ""; // role id
        

        if (!message.guild.roles.cache.get(requiredRoleId)) {
            return message.reply({
                content: "The role set is currently invalid.",
            });
        }


        if (!message.member.roles.cache.has(requiredRoleId)) {
          return;
        }

        try { 
            const amountRequired = '2' // amount required for votes
            const sessionChannelId = ""; // channel id
            const sessionChannel = message.guild.channels.cache.get(sessionChannelId);

            if (!sessionChannel) {
                return message.reply({
                    content: "The session channel could not be found.",
                });
            }

            const voteData = await SsuVote.findOne({});

            const imageEmbed = new EmbedBuilder()
                .setImage("https://media.discordapp.net/attachments/1433261489879519302/1433261519461679134/1.png?ex=6914870e&is=6913358e&hm=2e92cc4ab447b84e868934b8d3754b46fd26bc9190524d2b082a5aa4ce3b7cef&=&format=webp&quality=lossless&width=2576&height=764")
                .setColor("#242429");

            const embed = new EmbedBuilder()
                .setColor("#242429")
                .setTitle("Session Vote")
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(`An session vote has occured.\n\nWe need **${amountRequired}** votes`)
                .setImage('https://cdn.discordapp.com/attachments/1229606366759354368/1431062576586031236/image.png?ex=68fc0c62&is=68fabae2&hm=ea09b9a33e9f18db04dffa51246dad967fcd27fd903a6f13ae063011f17e4cf3&')
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
                content: `@here | <@&roleid>`, 
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
