const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Gmail-ის კონფიგურაცია
    // მნიშვნელოვანია: Gmail-ისთვის გჭირდებათ "App Password"
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `CodeLearning <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
