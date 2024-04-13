"use client";
import { ConversationPage } from "@maany_shr/planckster-ui-kit";
import { type Conversation } from "node_modules/@maany_shr/kernel-planckster-sdk-ts";

export type ListConversationsPageProps = {
  conversations: Conversation[];
  kernelPlancksterHost: string;
};

export function ListConversationsPage(props: ListConversationsPageProps) {
  return (
    <ConversationPage
      convs={props.conversations}
      onAddConversationClick={() => {console.log("Add conversation clicked")}}  // TODO: add the mutation here
      apiUrl={props.kernelPlancksterHost}
    />
  );
}