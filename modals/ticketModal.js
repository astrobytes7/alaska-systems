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

    const banner = new EmbedBuilder()
      .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500292434738024468/image.png?ex=69f7e7b6&is=69f69636&hm=ae91837cb6814f209e3c66cbff1048ebfe382f923032053e025b3a9138fda1ab&=&format=webp&quality=lossless&width=2834&height=849')
      .setColor('#242429')

    const embed = new EmbedBuilder()
      .setTitle('Support Ticket')
      .setColor('#242429')
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription(`Thank you for contacting **<:alaskalogo112:1499028371479199909> Alaska State Roleplay** Support. Please do not ping any staff member, as they have already been pinged regarding your issue. Thank you for understanding.`)
      .addFields(
        { name: 'Inquiry', value: `${inquiry}`, inline: true },
        { name: 'Roblox ID', value: 'Undefined', inline: true },
      )
      .setImage('https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194');

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
      embeds: [banner, embed],
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
