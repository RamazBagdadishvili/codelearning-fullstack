const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // შემოწმება: კონფიგურირებულია თუ არა ელ-ფოსტა
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_gmail_app_password') {
        console.warn('⚠️ Email credentials not configured. Skipping email send.');
        throw new Error('ელ-ფოსტის სერვისი არ არის კონფიგურირებული. გთხოვთ დაუკავშირდით ადმინისტრატორს.');
    }

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
