"use client";
import { ChatPage } from "@maany_shr/planckster-ui-kit";
import type { ChatMessageProps } from "@maany_shr/planckster-ui-kit";


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