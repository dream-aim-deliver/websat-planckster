"use client";
import { type TConversation } from "~/lib/core/entity/kernel-models";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";


export function ListConversationsClientPage(viewModel: TListConversationsViewModel) {
  if (viewModel.status == "error") {
    return (
      <div>
        <h1>Error</h1>
        <p>{viewModel.message}</p>
      </div>
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