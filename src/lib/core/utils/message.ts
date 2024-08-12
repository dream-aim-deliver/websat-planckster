import { type TImageMessage } from "~/lib/core/entity/kernel-models";

export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
        // Convert the Uint8Array to a binary string
        let binaryString = '';
        uint8Array.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
        });
    
        // Use btoa to convert the binary string to base64
        return btoa(binaryString);
    }



export const recodeImageToUint8Array = (
  imageMessage: TImageMessage
): Uint8Array => {

  const content = imageMessage.content;

  // the content will start with a "#image#" that needs to be taken out before recoding
  const base64Image = content.split("#image#")[1];

  if (!base64Image) {
    throw new Error("Invalid image message content");
  }

  const binaryString = atob(base64Image);

  const length = binaryString.length;

  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;

};