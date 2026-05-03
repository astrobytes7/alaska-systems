const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const DiscordTranscripts = require('discord-html-transcripts');
const Ticket = require('../models/ticketSchema');
const fs = require('fs');
const path = require('path');

async function closeTicket(channel, closer, client, reason = 'No reason provided.') {
    const transcriptChannelId = '1500199554786525254'; // channel id

    try {
        const ticket = await Ticket.findOne({ channelId: channel.id });
        if (!ticket) {
            console.error('Ticket not found in the database during closure.');
            return;
        }

        const closureReason = reason || ticket.closeReason || 'No reason provided.';

        await Ticket.findOneAndUpdate(
            { channelId: channel.id },
            {
                status: 'closed',
                closedBy: closer.id,
                closeReason: closureReason,
            }
        );

        const transcript = await DiscordTranscripts.createTranscript(channel, {
            limit: -1,
            returnType: 'string',
            saveImages: true,
        });

        const fileName = `${ticket.username}-${ticket.ticketId}.html`;
        const filePath = path.join(__dirname, '../public/transcripts', fileName);

        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        fs.writeFileSync(filePath, transcript);

        const onlineTranscriptURL = `${client.config.DOMAIN}/transcripts/${fileName}`;

        const transcriptFile = new AttachmentBuilder(Buffer.from(transcript), {
            name: fileName,
        });

        const logEmbed = new EmbedBuilder()
            .setTitle('Ticket Closed')
            .setColor('#242429')
            .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194')
            .addFields(
                { name: 'Closed By', value: closer.id === 'AI' ? 'AI Support' : `<@${closer.id}>`, inline: true },
                { name: 'Reason', value: closureReason, inline: true },
                { name: 'Online Transcript', value: `[View Transcript](${onlineTranscriptURL})`, inline: false },
            )
            .setFooter({
                text: `User ID: ${ticket.userId} | Ticket ID: ${ticket.ticketId}`,
            })
            .setTimestamp();

        const dmEmbed = new EmbedBuilder()
            .setTitle('Your Ticket Has Been Closed')
            .setColor('#242429')
            .setDescription('Your support ticket has been closed.')
            .addFields(
                { name: 'Closed By', value: closer.id === 'AI' ? 'AI Support' : `<@${closer.id}>`, inline: true },
                { name: 'Reason', value: closureReason, inline: true },
                { name: 'Online Transcript', value: `[View Transcript](${onlineTranscriptURL})`, inline: true },
            )
            .setFooter({ text: `Ticket ID: ${ticket.ticketId}` })
            .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194')
            .setTimestamp();

        const logChannel = await client.channels.fetch(transcriptChannelId);
        await logChannel.send({
            embeds: [logEmbed],
            files: [transcriptFile],
        });

        const user = await client.users.fetch(ticket.userId).catch(() => null);

        if (user) {
            await user.send({ embeds: [dmEmbed] }).catch(() => {});
        }

        setTimeout(async () => {
            await channel.delete().catch(err => {
                console.error('Error deleting ticket channel:', err);
            });
        }, 3000);

    } catch (error) {
        console.error('Error in closeTicket utility:', error);
    }
}

module.exports = { closeTicket };
