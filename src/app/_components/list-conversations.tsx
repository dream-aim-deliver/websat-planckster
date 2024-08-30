"use client";
import { type TConversation } from "~/lib/core/entity/kernel-models";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { type ConversationAGGridProps, ConversationAGGrid } from "@maany_shr/rage-ui-kit"


export function ListConversationsClientPage(viewModel: TListConversationsViewModel) {

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