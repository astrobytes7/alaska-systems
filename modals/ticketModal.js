const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const Ticket = require('../models/ticketSchema');
const { selectionMap } = require('../dropdowns/ticketDropdown');

module.exports = {
  customID: 'ticketModal',

  async execute(interaction) {
    const selectedValue = selectionMap.get(interaction.user.id);
    if (!selectedValue) {
      return interaction.reply({
        content: 'Could not determine ticket type. Please try again.',
        ephemeral: true,
      });
    }

    selectionMap.delete(interaction.user.id);

    const inquiry = interaction.fields.getTextInputValue('inquiry');
    const guild = interaction.guild;
    const user = interaction.user;

    const ticketConfig = {
      general: {
        role: '1497750066134388927', // general support role id
        category: '1500196688831189062', // general category id
      },
      management: {
        role: '1497748722849681540', // management role id
        category: '1500196688831189062', // management category id
      },
    };

    const config = ticketConfig[selectedValue];
    if (!config) {
      return interaction.reply({
        content: 'Invalid ticket type selected.',
        ephemeral: true,
      });
    }

    const channel = await guild.channels.create({
      name: `${user.username}-${selectedValue}`,
      type: ChannelType.GuildText,
      parent: config.category,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: config.role,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
      ],
    });

    const ticketId = channel.id;

    const embed = new EmbedBuilder()
      .setTitle('Support Ticket')
      .setColor('#242429')
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription(`Ticket type: **${selectedValue}**\nInquiry: **${inquiry}**`)
      .addFields(
        { name: 'Discord ID', value: user.id, inline: true },
        { name: 'Roblox ID', value: 'Undefined', inline: true },
      )
      .setFooter({ text: `Ticket ID: ${ticketId}` })
      .setImage('https://media.discordapp.net/attachments/1400662781216296960/1500195426853323002/image.png?ex=69f78d5e&is=69f63bde&hm=3e459f9318cc150750c471f0e8afbdf77ad2b5f58096ee456ac69b604574a6e5&=&format=webp&quality=lossless&width=2834&height=194')
      .setTimestamp();

    const claimButton = new ButtonBuilder()
      .setCustomId('claimTicket')
      .setLabel('Claim')
      .setStyle(ButtonStyle.Secondary);

    const closeButton = new ButtonBuilder()
      .setCustomId('closeTicket')
      .setLabel('Close')
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder().addComponents(claimButton, closeButton);

    const ticketMessage = await channel.send({
      content: `<@${user.id}> | <@&${config.role}>`,
      embeds: [embed],
      components: [actionRow],
    });

    await Ticket.create({
      userId: user.id,
      username: user.username,
      channelId: channel.id,
      messageId: ticketMessage.id,
      status: 'open',
      createdAt: new Date(),
      claimedBy: null,
      claimStatus: 'unclaimed',
      closedBy: null,
      ticketId,
    });

    await interaction.reply({
      content: `Your **${selectedValue}** ticket has been created - <#${channel.id}>`,
      ephemeral: true,
    });
  },
};
