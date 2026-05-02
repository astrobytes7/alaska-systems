module.exports = {
    name: 'say',
    description: 'Sends your message as the bot.',
    async execute(message, args) {
        const requiredRoleId = ''; // role ID of who can use this command

        if (!message.guild.roles.cache.get(requiredRoleId)) {
            return message.reply("The role set is currently invalid.");
        }

        if (!message.member.roles.cache.has(requiredRoleId)) {
            return message.reply("You do not have permission to use this command.");
        }

        if (!args.length) {
            return message.reply("You must provide a message for me to say!");
        }

        const sayMessage = args.join(' ');
        await message.channel.send(sayMessage);
    },
};
