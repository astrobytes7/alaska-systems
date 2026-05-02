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
        role: '', // general support role id
        category: '', // general category id
      },
      management: {
        role: '', // management role id
        category: '', // management category id
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
      .setTitle('New Ticket')
      .setColor('#242429')
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription(`Ticket type: **${selectedValue}**\nInquiry: **${inquiry}**`)
      .addFields(
        { name: 'field', value: 'None', inline: true },
        { name: '2nd field', value: 'none', inline: true },
      )
      .setFooter({ text: `Ticket ID: ${ticketId}` })
      .setImage('https://media.discordapp.net/attachments/1433261489879519302/1433261520019783882/2.png?ex=6913de4f&is=69128ccf&hm=a0d23fe0915dfaedff9c09793a183a97db72c85569dd2f261b9f7ecd56832044&=&format=webp&quality=lossless&width=2576&height=120')
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
