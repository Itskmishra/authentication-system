import nodemailer from "nodemailer";
import { EMAIL_CREDS } from "./config";

// configuraiton for simple mail server
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_CREDS.EMAIL_USERNAME,
    pass: EMAIL_CREDS.EMAIL_PASSWORD,
  },
});

// create a send function which
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: `codecat placemnet <${EMAIL_CREDS.EMAIL_USERNAME}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    logging.info("Something went wrong in send mail function");
  }
};
