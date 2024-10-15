const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // 587 için TLS kullanıyoruz, bu yüzden secure false olmalı
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
      }
  });

  let info = await transporter.sendMail(mailOptions);
  console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;