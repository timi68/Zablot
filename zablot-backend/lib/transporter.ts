import nodemailer from "nodemailer";

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;
const host = process.env.MAIL_HOST;

// Setting Up For Mailing
export default nodemailer.createTransport({
  host,
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});
