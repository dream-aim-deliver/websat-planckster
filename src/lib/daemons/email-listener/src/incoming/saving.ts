import { ClientService } from "@maany_shr/kernel-planckster-sdk-ts";
import { authToken, clientId } from "../config.js";
import { Attachment, ParsedMail } from "mailparser";
import { MessageDetails } from "../models.js";
import axios from "axios";

export const getRootPath = (details: MessageDetails): string => {
  return `users/${details.fromName}/${details.companyId}/${details.jobId}`;
};

export const saveAttachments = async (mail: ParsedMail, rootPath: string) => {
  // TODO: collect and output errors
  try {
    if (!mail.attachments || mail.attachments.length === 0) {
      console.log("No attachments found in the email");
      return [];
    }

    // TODO: process other types of attachments
    const pdfAttachments = mail.attachments.filter((attachment) => attachment.contentType === "application/pdf");

    if (pdfAttachments.length === 0) {
      console.log("No PDF attachments found in the email");
      return [];
    }

    console.log(`Found ${pdfAttachments.length} PDF attachments`);

    for await (const attachment of pdfAttachments) {
      await uploadAttachment(attachment, rootPath);
    }
  } catch (error: any) {
    console.error("Error saving attachments:", error);
    throw new Error(`Failed to save attachments: ${error.message}`);
  }
};

async function uploadAttachment(attachment: Attachment, rootPath: string): Promise<string | null> {
  try {
    const filename = attachment.filename ?? `attachment_${Date.now()}.pdf`;
    const relativePath = `${rootPath}/${Date.now()}_${filename}`;

    const linkData = await ClientService.getClientDataForUpload({
      id: clientId,
      protocol: "s3",
      relativePath,
      xAuthToken: authToken,
    });

    if (!linkData || !linkData.signed_url) {
      console.error("Failed to get signed URL for attachment:", filename);
      return null;
    }

    const fileContent = attachment.content;

    const uploadResponse = await axios.put(linkData.signed_url, fileContent, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
      console.log(`Successfully uploaded attachment: ${filename}`);
      return relativePath;
    } else {
      console.error("Failed to upload attachment:", filename, uploadResponse.status);
      return null;
    }
  } catch (error) {
    console.error("Error uploading attachment:", error);
    return null;
  }
}
