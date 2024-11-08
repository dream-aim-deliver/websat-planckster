"use client";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { useState } from "react";
import type { Signal } from "~/lib/core/entity/signals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import { ConversationAGGrid, type ConversationRow } from "@maany_shr/rage-ui-kit";
import { useRouter } from "next/navigation";
import { createConversationMutation, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY, queryConversations } from "~/app/queries";

export function ListConversationsClientPage(props: { viewModel: TListConversationsViewModel; researchContextID: number }) {
  const [listConversationsViewModel, setListConversationsViewModel] = useState<TListConversationsViewModel>(props.viewModel);

  const [createConversationViewModel, setCreateConversationViewModel] = useState<TCreateConversationViewModel>({
    status: "request",
  } as TCreateConversationViewModel);

  const queryClient = useQueryClient();

  const { isFetching, isLoading, isError } = useQuery<Signal<TListConversationsViewModel>>({
    queryKey: [`list-conversations#${props.researchContextID}`],
    queryFn: queryConversations(setListConversationsViewModel, props.researchContextID),
  });

  const enableCreateConversation = !isFetching || !isLoading;

  const mutation = useMutation({
    mutationKey: ["create-conversation"],
    retry: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`list-conversations#${props.researchContextID}`] });
    },
    mutationFn: createConversationMutation(setCreateConversationViewModel),
  });

  const handleCreateConversation = (title: string) => {
    mutation.mutate({ title, researchContextID: props.researchContextID });
  };

  const router = useRouter();

  const handleGoToConversation = (conversationID: number) => {
    router.push(`conversations/${conversationID}`);
  };

  if (listConversationsViewModel.status === "success") {
    return (
      <ConversationAGGrid
        isLoading={isFetching || isLoading}
        rowData={listConversationsViewModel.conversations as ConversationRow[]}
        handleGoToConversation={handleGoToConversation}
        handleNewConversation={handleCreateConversation}
        newConversationIsEnabled={enableCreateConversation}
      />
    );
  } else {
    return (
      <ConversationAGGrid
        isLoading={false}
        rowData={[]}
        handleGoToConversation={handleGoToConversation}
        handleNewConversation={handleCreateConversation}
        newConversationIsEnabled={enableCreateConversation}
        errorOverlayProps={{
          errorStatus: true,
          overlayText: `Error: ${JSON.stringify(listConversationsViewModel)}`,
        }}
      />
    );
  }
}
