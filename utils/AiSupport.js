const { OpenAI } = require("openai");
const { getServerData } = require("./ErlcApi");
const Ticket = require("../models/ticketSchema");

async function handleAiResponse(message, client) {
    // Check if the message is in a ticket channel
    const ticket = await Ticket.findOne({ channelId: message.channel.id, status: 'open' });
    if (!ticket) return;

    // Ignore bot messages
    if (message.author.bot) return;

    // "I need a human" handoff logic
    const handoffTriggers = ["human", "staff", "person", "someone", "real", "handoff"];
    if (message.content.toLowerCase().includes("human") || message.content.toLowerCase().includes("need staff")) {
        const staffRole = '1497748722849681540'; // management/staff role id
        return await message.reply(`A staff member has been alerted to your request. Please wait for a <@&${staffRole}> to assist you.`);
    }

    const grok = new OpenAI({
        apiKey: client.config.GROK_API,
        baseURL: "https://api.x.ai/v1",
    });

    const serverData = await getServerData();

    // Restriction check for Staff Handbook
    if (message.content.toLowerCase().includes("handbook")) {
        const staffRoleId = '1497748722849681540';
        const isStaff = message.member.roles.cache.has(staffRoleId);
        if (!isStaff) {
            return message.reply("I'm sorry, but I can only provide the staff handbook to authorized personnel.");
        }
    }

    try {
        const response = await grok.chat.completions.create({
            model: "grok-beta",
            messages: [
                {
                    role: "system",
                    content: `You are an AI support agent for Alaska State Roleplay. 
                    Strict Rules:
                    - Respond ONLY in plain text.
                    - NEVER use emojis.
                    - Be helpful but professional.
                    - You have access to live server data: ${JSON.stringify(serverData)}.
                    - If asked about the staff handbook, you can provide summaries only if authorized (handled by system).
                    - If the user seems frustrated or specifically asks for a person, the system will handle the ping.`
                },
                { role: "user", content: message.content }
            ],
        });

        const reply = response.choices[0].message.content;
        await message.reply(reply);

    } catch (err) {
        console.error("Grok API Error:", err);
    }
}

module.exports = { handleAiResponse };
