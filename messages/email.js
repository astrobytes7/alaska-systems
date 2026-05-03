const nodemailer = require('nodemailer');

module.exports = {
    name: "email",
    description: "Send an email to a specified address.",
    async execute(message, args, client) {
        // Permissions check: Only administrators can send emails
        if (!message.member.permissions.has('Administrator')) {
            return message.reply("You need Administrator permissions to use this command.");
        }

        const targetEmail = args[0];
        const emailMessage = args.slice(1).join(' ');

        if (!targetEmail || !emailMessage) {
            return message.reply(`Usage: ${client.config.PREFIX}email {email} {message}`);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(targetEmail)) {
            return message.reply("Please provide a valid email address.");
        }

        const statusMessage = await message.reply("<:loading:1456476622830829568> Attempting to send email...");

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `"Alaska State Roleplay" <${process.env.EMAIL_USER}>`,
                to: targetEmail,
                subject: 'Message from Alaska State Roleplay Support',
                text: emailMessage,
                html: `<div style="font-family: sans-serif; padding: 20px; color: #242429;">
                        <h2>Alaska State Roleplay</h2>
                        <p>${emailMessage.replace(/\n/g, '<br>')}</p>
                        <hr>
                        <p style="font-size: 0.8em; color: #666;">This is an automated message sent from the Alaska Systems Bot.</p>
                       </div>`,
            };

            await transporter.sendMail(mailOptions);

            await statusMessage.edit("<:success:1456476624512745472> Email sent successfully!");
        } catch (error) {
            console.error("Email Error:", error);
            await statusMessage.edit(`<:error:1456476626190450688> Failed to send email: ${error.message}`);
        }
    }
};
