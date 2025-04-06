import { ParsedMail } from "mailparser";
import { templatesDir } from "../config.js";
import { MessageDetails } from "../models.js";
import * as fs from "node:fs";
import { sendEmail } from "../smtp.js";

export const getEmailTemplate = async (templateName: string): Promise<string> => {
  try {
    const templatePath = `${templatesDir}/${templateName}.html`;
    return await fs.promises.readFile(templatePath, "utf8");
  } catch (error) {
    console.error(`Error reading email template: ${error}`);
    throw error;
  }
};

export const fillEmailTemplate = async (templateName: string, data: Record<string, string>): Promise<string> => {
  try {
    const templateHtml = await getEmailTemplate(templateName);

    let filledTemplate = templateHtml;

    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      filledTemplate = filledTemplate.replace(new RegExp(placeholder, "g"), value);
    }

    return filledTemplate;
  } catch (error) {
    console.error(`Error processing email template: ${error}`);
    throw error;
  }
};

export const sendWhitelistError = async (mail: ParsedMail) => {
  const name = mail.from?.value[0]?.name;
  if (!name) {
    throw Error("Missing sender name");
  }
  const content = await fillEmailTemplate("whitelist-error", {
    name: name,
  });
  await sendReply(mail, { html: content });
};

export const sendCompanyProcessingSuccess = async (mail: ParsedMail, details: MessageDetails) => {
  const content = `Thank you for your email! The processing has begun with the following details:\n\nCompany ID: ${details.companyId}\nJob ID: ${details.jobId}`;
  await sendReply(mail, { text: content });
};

export const sendCompanyProcessingError = async (mail: ParsedMail) => {
  const name = mail.from?.value[0]?.name;
  if (!name) {
    throw Error("Missing sender name");
  }
  const content = await fillEmailTemplate("company-id-error", {
    name: name,
  });
  await sendReply(mail, { html: content });
};

export interface ReplyContent {
  subject?: string;
  text?: string;
  html?: string;
}

export const sendReply = async (mail: ParsedMail, content: ReplyContent) => {
  if (!mail.messageId) {
    console.error("Missing message ID");
    return;
  }
  if (!mail.from || !mail.to) {
    console.error("Missing sender information");
    return;
  }
  const address = mail.from.value[0]?.address;
  if (!address) {
    console.error("Invalid sender address");
    return;
  }
  const replyOptions = {
    to: address,
    subject: content.subject ?? `Re: ${mail.subject}`,
    text: content.text,
    html: content.html,
    inReplyTo: mail.messageId,
    references: [mail.messageId],
  };
  await sendEmail(replyOptions);
};
