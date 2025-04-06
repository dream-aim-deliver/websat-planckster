import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["EMAIL_ADDRESS", "EMAIL_PASSWORD", "SMTP_HOST", "SMTP_PORT"];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const smtpConfig = {
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT!),
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS!,
    pass: process.env.EMAIL_PASSWORD!,
  },
};

export interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  inReplyTo?: string;
  references?: string[];
}

export const sendEmail = async (options: MailOptions) => {
  try {
    const transporter = nodemailer.createTransport(smtpConfig);
    if (!options.text && !options.html) {
      throw new Error("Either text or html content must be provided");
    }
    options.from = options.from ?? process.env.EMAIL_ADDRESS;
    const info = await transporter.sendMail(options);
    console.log("Message sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
