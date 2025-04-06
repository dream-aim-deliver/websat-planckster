import { imap, mailboxName, whitelist } from "../config.js";
import Imap from "imap";
import { sendCompanyProcessingError, sendCompanyProcessingSuccess, sendReply, sendWhitelistError } from "../outcoming/messages.js";
import { extractMessageDetails, parseMessage } from "./parsing.js";
import { MessageDetails } from "../models.js";
import { ParsedMail } from "mailparser";
import { getRootPath, saveAttachments } from "./saving.js";

// Temporary date for testing
const afterDate = new Date("2025-04-05T00:00:00Z");
const searchDate = afterDate
  .toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  .replace(/,/g, "");

const isAddressWhitelisted = (mail: ParsedMail): boolean => {
  const address = mail.from?.value[0]?.address;
  return address !== undefined && whitelist.includes(address);
};

const processNewEmails = () => {
  imap.search(["UNSEEN", ["SINCE", searchDate]], (err: Error | null, results: number[]) => {
    if (err) {
      console.error("Error searching for unread messages:", err);
      return;
    }

    if (results.length === 0) {
      console.log("No new messages");
      return;
    }

    const fetch = imap.fetch(results, { bodies: "", markSeen: true });

    fetch.on("message", async (msg: Imap.ImapMessage, sequenceNumber: number) => {
      console.log(`Processing message #${sequenceNumber}`);
      const mail = await parseMessage(msg);

      if (!isAddressWhitelisted(mail)) {
        console.error(`Message #${sequenceNumber} is not from a whitelisted address`);
        sendWhitelistError(mail);
        return;
      }

      // TODO: check if the thread is already being processed

      let details: MessageDetails;

      try {
        // TODO: extract the address and name first
        // TODO: extract the companyId from the saved thread details
        details = extractMessageDetails(mail);
      } catch (_) {
        console.error(`Couldn't extract company ID from message #${sequenceNumber}`);
        sendCompanyProcessingError(mail);
        return;
      }

      sendCompanyProcessingSuccess(mail, details);
      const rootPath = getRootPath(details);
      // TODO: send an email if errors occur or there is incomplete data
      await saveAttachments(mail, rootPath);
      // TODO: Run the LLM processing script with the rootPath, fromAddress and messageId
    });
  });
};

export const startMailboxListening = () => {
  imap.openBox(mailboxName, false, (err: Error | null, box: Imap.Box) => {
    if (err) {
      console.error("Error opening inbox:", err);
      return;
    }

    imap.on("mail", (newMessageCount: number) => processNewEmails());
  });
};
