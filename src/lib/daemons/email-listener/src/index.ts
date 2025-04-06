import { imap } from "./config.js";
import { startMailboxListening } from "./incoming/processing.js";

imap.once("ready", () => {
  console.log("IMAP connection established");
  startMailboxListening();
});

imap.once("error", (err: Error) => {
  console.error("IMAP connection error:", err);
});

imap.once("end", () => {
  console.log("IMAP connection ended");
});

// Connect to server
console.log("Connecting to IMAP server...");
imap.connect();

// Prevent the process from exiting
process.on("SIGINT", () => {
  console.log("Disconnecting from IMAP server...");
  imap.end();
  process.exit(0);
});
