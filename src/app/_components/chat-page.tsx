"use client";

import { ChatPage, useToast } from "@maany_shr/rage-ui-kit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Signal } from "~/lib/core/entity/signals";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import { type TBrowserListMessagesForConversationControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-messages-for-conversation-controller";
import type BrowserListMessagesForConversationController from "~/lib/infrastructure/client/controller/browser-list-messages-for-conversation-controller";
import { type TBrowserSendMessageToConversationControllerParameters } from "~/lib/infrastructure/client/controller/browser-send-message-to-conversation-controller";
import type BrowserSendMessageToConversationController from "~/lib/infrastructure/client/controller/browser-send-message-to-conversation-controller";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import { TMessage } from "~/lib/core/entity/kernel-models";

export function ChatClientPageSkeleton() {
  return (
    <ChatPage
      messages={[]}
      onSendMessage={() => {
        console.log("Loading, please wait...");
      }}
    />
  );
}

export function ChatClientPage(props: { listMessagesViewModel: TListMessagesForConversationViewModel; researchContextExternalID: string; researchContextID: number; conversationID: number }) {
  const [listMessagesViewModel, setListMessagesViewModel] = useState<TListMessagesForConversationViewModel>(props.listMessagesViewModel);

  const emptySendMessageViewModel: TSendMessageToConversationViewModel = {
    status: "request",
    researchContextID: props.researchContextID,
    conversationID: props.conversationID,
    messageContent: "",
  };

  const [sendMessageViewModel, setSendMessageViewModel] = useState<TSendMessageToConversationViewModel>(emptySendMessageViewModel);

  // A state for displaying a message that is being processed
  const [requestedMessage, setRequestedMessage] = useState<TMessage | null>();

  const queryClient = useQueryClient();

  const { isFetching, isLoading, isError } = useQuery<Signal<TListMessagesForConversationViewModel>>({
    queryKey: [`list-messages-for-conversation#${props.conversationID}`],
    queryFn: async () => {
      const signalFactory = signalsContainer.get<(initialValue: TListMessagesForConversationViewModel, update?: (value: TListMessagesForConversationViewModel) => void) => Signal<TListMessagesForConversationViewModel>>(
        SIGNAL_FACTORY.KERNEL_LIST_MESSAGES_FOR_CONVERSATION,
      );
      const response: Signal<TListMessagesForConversationViewModel> = signalFactory(
        {
          status: "request",
          conversationID: props.conversationID,
        },
        setListMessagesViewModel,
      );
      const controllerParameters: TBrowserListMessagesForConversationControllerParameters = {
        response: response,
        conversationID: props.conversationID,
      };
      const controller = clientContainer.get<BrowserListMessagesForConversationController>(CONTROLLERS.LIST_MESSAGES_FOR_CONVERSATION_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  const mutation = useMutation({
    mutationKey: ["send-message-to-conversation"],
    retry: 3,
    retryDelay: 3000,

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [`list-messages-for-conversation#${props.conversationID}`] });
    },

    mutationFn: async (message: string) => {
      const signalFactory = signalsContainer.get<(initialValue: TSendMessageToConversationViewModel, update?: (value: TSendMessageToConversationViewModel) => void) => Signal<TSendMessageToConversationViewModel>>(
        SIGNAL_FACTORY.SEND_MESSAGE_TO_CONVERSATION,
      );

      const response: Signal<TSendMessageToConversationViewModel> = signalFactory(
        {
          status: "request",
          researchContextID: props.researchContextID,
          conversationID: props.conversationID,
          messageContent: message,
        } as TSendMessageToConversationViewModel,
        setSendMessageViewModel,
      );

      const controller = clientContainer.get<BrowserSendMessageToConversationController>(CONTROLLERS.SEND_MESSAGE_TO_CONVERSATION_CONTROLLER);

      const controllerParameters: TBrowserSendMessageToConversationControllerParameters = {
        response: response,
        researchContextExternalID: props.researchContextExternalID,
        conversationID: props.conversationID,
        messageToSendContent: message,
        messageToSendTimestamp: `${Math.floor(Date.now() / 1000)}`,
      };

      await controller.execute(controllerParameters);

      await queryClient.invalidateQueries({ queryKey: [`list-messages-for-conversation#${props.conversationID}`] });
    },
  });

  const handleSendMessage = (message: string) => {
    console.log("Sending message: ", message);
    // Set the message posting request as ongoing
    setSendMessageViewModel(emptySendMessageViewModel);
    setRequestedMessage({
      message_contents: [{ content: message, content_type: "text" }],
      sender: "",
      sender_type: "user",
      // In contrast to the request timestamp, this one is expected in milliseconds
      created_at: `${Date.now()}`,
    });
    mutation.mutate(message);
  };

  const getMessagesWithStatus = () => {
    if (listMessagesViewModel.status !== "success") return [];

    const allMessages = listMessagesViewModel.messages.map((message) => ({
      ...message,
      status: "success",
    }));

    if (sendMessageViewModel.status !== "success" && requestedMessage) {
      allMessages.push({
        ...requestedMessage,
        status: sendMessageViewModel.status === "error" ? "error" : "request",
      });
    }

    return allMessages;
  };

  const { toast } = useToast();

  useEffect(() => {
    if (sendMessageViewModel.status === "error") {
      toast({
        title: "Error sending the message",
        description: sendMessageViewModel.message,
        variant: "error",
      });
    }
  }, [sendMessageViewModel]);

  if (listMessagesViewModel.status === "request") {
    return (
      <ChatPage
        messages={[]}
        onSendMessage={() => {
          console.log("Loading, please wait...");
        }}
      />
    );
  } else if (listMessagesViewModel.status === "error") {
    throw new Error(listMessagesViewModel.message);
  } else if (listMessagesViewModel.status === "success") {
    return <ChatPage messages={getMessagesWithStatus()} onSendMessage={handleSendMessage} />;
  }

  throw new Error("Invalid state");
}
