"use client";
import { type TConversation } from "~/lib/core/entity/kernel-models";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { type ConversationAGGridProps, ConversationAGGrid } from "@maany_shr/rage-ui-kit"
import { useState } from "react";
import signalsContainer from "~/lib/infrastructure/client/config/ioc/signals-container";
import { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";


// TODO: look at one of the ralph pages
export function ListConversationsClientPage(viewModel: TListConversationsViewModel) {

  const [ListConversationsViewModel, setListConversationsViewModel] = useState<TListConversationsViewModel>({
    status: "request",
  });

  const signalFactory = signalsContainer.get<(update: (value: TListConversationsViewModel) => void, initialValue: TListConversationsViewModel ) => Signal<TListConversationsViewModel>
  >(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS);

  const S_KERNEL_LIST_CONVERSATIONS_VIEW_MODEL = signalFactory(setListConversationsViewModel, {
    status: "request",
  });



  if (viewModel.status == "error") {

    const errorOverlayProps = {
      errorStatus: true,
      overlayText: `An error occurred: ${viewModel.message}`
    }

    console.log(`An error occurred: ${viewModel.message}.\nContext of the error:\n${viewModel.context}`)

    console.log(`dump of the VM: ${JSON.stringify(viewModel)}`)

    const conversationAGGridProps: ConversationAGGridProps = {
      rowData: [],
      isLoading: false,
      goToConversation: () => "",
      handleNewConversation: () => "",
      errorOverlayProps: errorOverlayProps
    }
      
    return (
      <ConversationAGGrid {...conversationAGGridProps} />
      //<div>
        //<h1>Error</h1>
        //<p>{viewModel.message}</p>
      //</div>
    );
  }

  if (viewModel.status == "success") {
    return (
      <div>
        <h1>Conversations</h1>
        <ul>
          {viewModel.conversations.map((conversation: TConversation) => (
            <li key={conversation.id}>{conversation.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}