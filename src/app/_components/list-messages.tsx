"use client";
import { ChatPage } from "@maany_shr/planckster-ui-kit";

export type ChatMessageProps = {
  senderName: string;
  senderImage: string;
  message: string;
  sentTime: string;
  isDelivered?: boolean; // prop for delivered status
  repliedToId?: string; // prop for ID of replied-to message
  role?: "user" | "llm"; // prop for specifying alignment
};

export type ChatPageProps = {
  chatMessageProps: ChatMessageProps[];
};

export function ListMessagesPage(props: ChatPageProps) {
  return (
    <ChatPage
      chatMessageProps={props.chatMessageProps}
    />
  );
}