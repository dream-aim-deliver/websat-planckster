import Imap from "imap";
import { ParsedMail, simpleParser } from "mailparser";
import { v4 as uuidv4 } from "uuid";
import { MessageDetails } from "../models.js";

export const parseMessage = async (msg: Imap.ImapMessage): Promise<ParsedMail> => {
  return new Promise((resolve, reject) => {
    let buffer = "";

    msg.on("body", (stream, info) => {
      stream.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
      });

      stream.on("end", () => {
        simpleParser(buffer)
          .then((mail) => {
            resolve(mail);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });

    msg.on("error", (err: Error) => {
      reject(err);
    });
  });
};

export const extractMessageDetails = (mail: ParsedMail): MessageDetails => {
  let companyId: string | null = null;
  const jobId = uuidv4();

  const companyRegex = /Company=(.*?)(?:\s|$)/;

  const subjectMatch = companyRegex.exec(mail.subject ?? "");
  companyId = subjectMatch?.[1]?.trim() ?? null;

  if (!companyId) {
    const textMatch = companyRegex.exec(mail.text ?? "");
    companyId = textMatch?.[1]?.trim() ?? null;
  }

  if (!companyId) {
    throw new Error("Company ID not found in email");
  }

  return {
    companyId,
    jobId,
  };
};
