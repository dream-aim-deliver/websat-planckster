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

const readWhitelist = (filePath: string): string[] => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

    return lines;
  } catch (error) {
    console.error(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};

export const whitelist = readWhitelist(process.env.WHITELIST_FILE ?? "./whitelist.txt");

export const authToken = process.env.KP_AUTH_TOKEN!;

export const clientId = parseInt(process.env.KP_CLIENT_ID!);

OpenAPI.BASE = process.env.KP_HOST!;
