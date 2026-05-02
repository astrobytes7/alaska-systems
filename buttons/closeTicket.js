const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const DiscordTranscripts = require('discord-html-transcripts');
const Ticket = require('../models/ticketSchema');
const fs = require('fs');
const path = require('path');

module.exports = {
  customID: 'closeTicket',

  async execute(interaction) {
    const transcriptChannelId = '1500199554786525254'; // channel id
    const requiredRoleId = '1497749785812140086'; // role id

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

    const channel = interaction.channel;
    const closer = interaction.user;

    try {
      await interaction.reply({
        content: 'Closing this ticket.',
        ephemeral: false,
      });

      const ticket = await Ticket.findOne({ channelId: channel.id });
      if (!ticket) {
        return interaction.editReply({
          content: 'Ticket not found in the database.',
        });
      }

      const closureReason = ticket.closeReason || 'No reason provided.';

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
        returnType: 'buffer',
        filename: `${ticket.username}-${ticket.ticketId}.html`,
        saveImages: false,
      });

      const fileName = `${ticket.username}-${ticket.ticketId}.html`;
      const filePath = path.join(__dirname, '../public/transcripts', fileName);
      
      // Ensure the directory exists
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      // Save the transcript to the local public folder
      fs.writeFileSync(filePath, transcript);

      const onlineTranscriptURL = `https://alaska.noteshan.xyz/transcripts/${fileName}`;

      const transcriptFile = new AttachmentBuilder(transcript, {
        name: fileName,
      });

      const logEmbed = new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setColor('#242429')
        .addFields(
          { name: 'Closed By', value: `<@${closer.id}>`, inline: true },
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
          { name: 'Closed By', value: `<@${closer.id}>`, inline: true },
          { name: 'Reason', value: closureReason, inline: true },
          { name: 'Online Transcript', value: `[View Transcript](${onlineTranscriptURL})`, inline: false },
        )
        .setFooter({ text: `Ticket ID: ${ticket.ticketId}` })
        .setImage('https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6913de4f&is=69128ccf&hm=a0d23fe0915dfaedff9c09793a183a97db72c85569dd2f261b9f7ecd56832044&=&format=webp&quality=lossless&width=2576&height=120')
        .setTimestamp();

      const logChannel = await interaction.client.channels.fetch(transcriptChannelId);
      await logChannel.send({
        embeds: [logEmbed],
        files: [transcriptFile],
      });

      const user = await interaction.client.users.fetch(ticket.userId).catch(() => null);

      if (user) {
        await user.send({ embeds: [dmEmbed] }).catch(() => {
          interaction.followUp({
            content: "Couldn't DM the user — their DMs are disabled.",
            ephemeral: true,
          }).catch(() => { });
        });
      } else {
        interaction.followUp({
          content: 'Unable to locate the user to DM.',
          ephemeral: true,
        }).catch(() => { });
      }

      setTimeout(async () => {
        await channel.delete().catch(err => {
          console.error('Error deleting ticket channel:', err);
        });
      }, 3000);

    } catch (error) {
      console.error('Error closing ticket:', error);

      try {
        await interaction.reply({
          content: 'Failed to close the ticket.',
          ephemeral: true,
        });
      } catch { }
    }
  },
};
