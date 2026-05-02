const { OpenAI } = require("openai");
const { getServerData } = require("./ErlcApi");
const { closeTicket } = require("./TicketActions");
const Ticket = require("../models/ticketSchema");

async function handleAiResponse(message, client) {
    // Check if the message is in a ticket channel
    const ticket = await Ticket.findOne({ channelId: message.channel.id, status: 'open' });
    if (!ticket || ticket.aiEnabled === false) return;

    // Ignore bot messages
    if (message.author.bot) return;

    // AI closure/handoff signals
    const lowerContent = message.content.toLowerCase();
    
    // Manual handoff check
    if (lowerContent.includes("i need a human") || lowerContent.includes("need staff")) {
        const staffRole = '1497748722849681540'; // management/staff role id
        ticket.aiEnabled = false;
        await ticket.save();
        return await message.reply(`A staff member has been alerted to your request. AI support has been disabled for this chat. Please wait for a <@&${staffRole}> to assist you.`);
    }

    // Manual closure check
    if (lowerContent.includes("close this ticket") || lowerContent.includes("close the ticket") || lowerContent.includes("i'm done")) {
        await message.reply("Understood. Closing this ticket now...");
        return await closeTicket(message.channel, { id: 'AI' }, client, 'User requested closure via AI.');
    }

    const groq = new OpenAI({
        apiKey: client.config.GROK_API,
        baseURL: "https://api.groq.com/openai/v1",
    });

    const serverData = await getServerData();

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an AI support agent for Alaska State Roleplay. 
                    Strict Rules:
                    - Respond ONLY in plain text.
                    - NEVER use emojis.
                    - Be helpful but professional.
                    - You have access to live server data: ${JSON.stringify(serverData)}.
                    - If the user wants to close the ticket, respond with exactly: "TRIGGER_CLOSE"
                    - If you do not know the answer or cannot help with a specific request, respond with exactly: "TRIGGER_HANDOFF"
                    - If asked about the staff handbook, you can provide summaries only if authorized.`
                },
                { role: "user", content: message.content }
            ],
        });

        const reply = response.choices[0].message.content.trim();

        if (reply.includes("TRIGGER_CLOSE")) {
            await message.reply("Understood. I will close this ticket for you.");
            return await closeTicket(message.channel, { id: 'AI' }, client, 'AI triggered closure based on user request.');
        }

        if (reply.includes("TRIGGER_HANDOFF")) {
            const staffRole = '1497748722849681540';
            ticket.aiEnabled = false;
            await ticket.save();
            return await message.reply(`I'm sorry, I don't have enough information to help with that. I've alerted our staff to assist you. Please wait for a <@&${staffRole}>.`);
        }

        await message.reply(reply);

    } catch (err) {
        console.error("Grok API Error:", err);
    }
}

module.exports = { handleAiResponse };
