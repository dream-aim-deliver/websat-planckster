"use client";
import { list } from "postcss";
//import { ChatPage } from "@maany_shr/rage-ui-kit";
import { useState } from "react";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";

export type MessageViewModel = {
  role: "user" | "agent";
  content: string;
  type: "text" | "image";
  timestamp: number;
  isLoading?: boolean;
};

export type ChatPageViewModel = {
  messages: MessageViewModel[];
  onSendMessage: (message: string) => void;
};

export function ChatClientPage(props: { listMessagesViewModel: TListMessagesForConversationViewModel; researchContextID: number; conversationID: number }) {
  const [listMessagesViewModel, setListMessagesViewModel] = useState<TListMessagesForConversationViewModel>(props.listMessagesViewModel);

  const [messageToSend, setMessageToSend] = useState<MessageViewModel>({
    role: "agent",
    content: "",
    type: "text",
    timestamp: -1,
    isLoading: true,
  });

  const [sendMessageViewModel, setSendMessaageViewModel] = useState<TSendMessageToConversationViewModel>({
    status: "request",
    researchContextID: props.researchContextID,
    conversationID: props.conversationID,
    messageContent: messageToSend.content,
  });

  if (listMessagesViewModel.status === "request") {
    return (
      <div>hi</div>
      //<ChatPage
      //messages={[]}
      //onSendMessage={(messsage: string) => {
      //console.log("hi");
      //}}
      ///>
    );
  } else if (listMessagesViewModel.status === "error") {
    return (
      <div>
        <p>Error: {listMessagesViewModel.message}</p>
        <p>Context: {JSON.stringify(listMessagesViewModel.context)}</p>
      </div>
    );
  } else if (listMessagesViewModel.status === "success") {
    console.log("hi");
  }

  return <div>Dummy</div>;
}
