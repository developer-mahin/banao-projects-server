const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

exports.emailVerification = async (mailData) => {
    try {

        const mailOption = {
            from: process.env.USER,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
        }

        const info = await transporter.sendMail(mailOption);
        console.log("message %s", info.response)
    } catch (error) {
        throw error
    }
}