const { Client, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { MONGOURL, TOKEN } = require('./config.js');
const { stopSessionUpdater, updateSessionStatus } = require('./utils/SessionUpdater.js')

const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "GuildPresences",
        "DirectMessages",
        "MessageContent"
    ]
});

// --- Transcript Hosting Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the transcripts folder publicly
app.use('/transcripts', express.static(path.join(__dirname, 'public/transcripts')));

// Health check route
app.get('/', (req, res) => {
    res.send('Alaska Transcript Server is Online!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Transcript server is running on port ${PORT}`);
});
// --------------------------------

client.config = require('./config.js');
client.messages = new Map();
client.terminalLogs = [];

const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
    const line = args.join(' ');
    client.terminalLogs.push(line);
    if (client.terminalLogs.length > 1000) client.terminalLogs.shift();
    originalLog.apply(console, args);
};

console.error = (...args) => {
    const line = args.join(' ');
    client.terminalLogs.push(`ERROR: ${line}`);
    if (client.terminalLogs.length > 1000) client.terminalLogs.shift();
    originalError.apply(console, args);
};

function formatTimestamp() {
    const d = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function logUserUsage(user, log) {
    const timestamp = formatTimestamp();
    const plainLog = `${timestamp} | ${user.username}#${user.discriminator}(${user.id}) | ${log}`;
    client.terminalLogs.push(plainLog);
    if (client.terminalLogs.length > 1000) client.terminalLogs.shift();

    originalLog(plainLog);
}

require('./utils/ComponentLoader.js')(client);
require('./utils/EventLoader.js')(client);
require('./utils/RegisterCommands.js')(client);

client.login(TOKEN);

client.once('clientReady', async () => {
    try {
        client.user.setActivity({
            name: 'Climbing over Alaska',
            type: ActivityType.Custom,
        });

        if (MONGOURL) {
            await mongoose.connect(MONGOURL);
            console.log('I have connected to the database successfully.');
        }

        console.log(`Logged in as ${client.user.tag}!`)

    } catch (err) {
        console.error('Error during ready event:', err);
    }
});

client.on('messageCreate', async (message) => {
    const prefix = client.config.PREFIX;
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(1).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    let command = client.messages.get(commandName);
    if (!command) {
        command = [...client.messages.values()].find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );
    }

    if (!command) return;

    try {
        logUserUsage(message.author, `-${commandName}${args.length ? ' ' + args.join(' ') : ''}`);
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

async function InteractionHandler(interaction, interactionType, interactionName) {
    const user = interaction.user;
    const name = interaction.commandName ?? interaction.customId;
    const component = client[interactionName].get(name);
    if (!component) return;

    try {
        if (interaction.isCommand()) {
            const options = interaction.options?.data?.map(opt => {
                if ('value' in opt) return opt.value;
                if ('options' in opt) return opt.options.map(o => o.value).join(',');
                return '';
            }).filter(Boolean).join(' ');
            logUserUsage(user, `/${interaction.commandName}${options ? ' ' + options : ''}`);
        } else if (interaction.isButton()) {
            logUserUsage(user, `[${interaction.component.label || 'Button'}](${interaction.customId})`);
        } else if (interaction.isStringSelectMenu()) {
            logUserUsage(user, `[${interaction.component.placeholder || 'Dropdown'}](${interaction.customId})`);
        } else if (interaction.isModalSubmit()) {
            logUserUsage(user, `[${interaction.customId}](${interaction.customId})`);
        }

        await component.execute(interaction, client);
    } catch (error) {
        console.error(`Interaction failed: ${name} - ${error}`);
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        await interaction.editReply({
            content: `${error}`,
            embeds: [],
            components: [],
            files: []
        }).catch(() => { });
    }
}

client.on('interactionCreate', async function (interaction) {
    if (interaction.isMessageContextMenuCommand())
        await InteractionHandler(interaction, 'Message Context Menu', 'context');
    else if (interaction.isUserContextMenuCommand())
        await InteractionHandler(interaction, 'User Context Menu', 'context');
    else if (interaction.isChatInputCommand())
        await InteractionHandler(interaction, 'Slash Command', 'commands');
    else if (interaction.isButton())
        await InteractionHandler(interaction, 'Button', 'buttons');
    else if (interaction.isStringSelectMenu())
        await InteractionHandler(interaction, 'Dropdown', 'dropdowns');
    else if (interaction.isModalSubmit())
        await InteractionHandler(interaction, 'Modal', 'modals');
});
