// import { https } from "firebase-functions";
// import { createTransport } from "nodemailer";

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, you may need to enable "less secure apps" in your account settings.
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for security
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = https.onRequest((req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use the same email as the sender
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    return res.status(200).send("Email sent: " + info.response);
  });
});