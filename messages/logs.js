module.exports = {
    name: 'logs',
    description: 'Fetch last 50 logs from terminal',
    async execute(message, args, client) {
        const requiredRoleId = "1498773946261045338";

        if (!message.member.roles.cache.has(requiredRoleId)) {
            return;
        }

        const logs = client.terminalLogs || [];
        const last50 = logs.slice(-30);
        if (!last50.length) return message.reply('No logs available.');

        const colorUsername = '\x1b[38;2;135;206;250m';
        const colorId = '\x1b[38;2;144;238;144m';
        const reset = '\x1b[0m';

        const formattedLogs = last50.map(line => {
            const match = line.match(/^(.+?) \| (.+?)#(\d{4})\((\d+)\) \| (.+)$/);
            if (!match) return line;

            const [, timestamp, username, discriminator, userId, logText] = match;

            return `${timestamp} | ${colorUsername}${username}#${discriminator}${reset}(${colorId}${userId}${reset}) | ${logText}`;
        });

        const chunks = [];
        let currentChunk = '';

        for (const line of formattedLogs) {
            if ((currentChunk + line + '\n').length > 1990) {
                chunks.push(currentChunk);
                currentChunk = '';
            }
            currentChunk += line + '\n';
        }
        if (currentChunk.length) chunks.push(currentChunk);

        for (const chunk of chunks) {
            await message.channel.send('```ansi\n' + chunk + '```');
        }
    },
};