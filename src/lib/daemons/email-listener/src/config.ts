import dotenv from "dotenv";
import Imap from "imap";
import * as fs from "node:fs";
import { OpenAPI } from "@maany_shr/kernel-planckster-sdk-ts";

dotenv.config();

const requiredEnvVars = ["EMAIL_ADDRESS", "EMAIL_PASSWORD", "IMAP_HOST", "IMAP_PORT", "KP_AUTH_TOKEN", "KP_CLIENT_ID", "KP_HOST"];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const imapConfig = {
  user: process.env.EMAIL_ADDRESS!,
  password: process.env.EMAIL_PASSWORD!,
  host: process.env.IMAP_HOST!,
  port: parseInt(process.env.IMAP_PORT!),
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

export const imap = new Imap(imapConfig);

export const mailboxName = process.env.MAILBOX_NAME ?? "INBOX";

export const templatesDir = process.env.TEMPLATES_DIR ?? "./templates";

export interface User {
  name: string;
  email: string;
}

const readUsersJson = (filePath: string): User[] => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const users: User[] = JSON.parse(fileContent);
    return users;
  } catch (error: any) {
    console.error(`Error reading users file: ${error.toString()}`);
    return [];
  }
};

export const users = readUsersJson(process.env.USERS_FILE ?? "./users.json");

export const whitelist = users.map((user) => user.email);

export const authToken = process.env.KP_AUTH_TOKEN!;

export const clientId = parseInt(process.env.KP_CLIENT_ID!);

OpenAPI.BASE = process.env.KP_HOST!;
