"use client";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { useEffect, useState } from "react";
import type { Signal } from "~/lib/core/entity/signals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import { ConversationAGGrid, useToast } from "@maany_shr/rage-ui-kit";
import { type ConversationRow } from "node_modules/@maany_shr/rage-ui-kit/dist/components/table/ConversationAGGrid";
import { useRouter } from "next/navigation";
import { createConversationMutation, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY, queryConversations } from "~/app/queries";

export function ListConversationsClientPage(props: { viewModel: TListConversationsViewModel; researchContextID: number }) {
  const [listConversationsViewModel, setListConversationsViewModel] = useState<TListConversationsViewModel>(props.viewModel);

  const [createConversationViewModel, setCreateConversationViewModel] = useState<TCreateConversationViewModel>({
    status: "request",
  } as TCreateConversationViewModel);

  const queryClient = useQueryClient();

  useQuery<Signal<TListConversationsViewModel>>({
    queryKey: [`list-conversations#${props.researchContextID}`],
    queryFn: queryConversations(setListConversationsViewModel, props.researchContextID),
  });

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

  const { toast } = useToast();

  useEffect(() => {
    if (createConversationViewModel.status === "error") {
      toast({
        title: "Error creating the conversation",
        description: createConversationViewModel.message,
        variant: "error",
      });
    }
  }, [createConversationViewModel]);

  const areConversationsLoading = listConversationsViewModel.status === "request";
  const rowData = listConversationsViewModel.status === "success" ? listConversationsViewModel.conversations : [];
  const errorOverlayProperties =
    listConversationsViewModel.status === "error"
      ? {
          errorStatus: true,
          overlayText: listConversationsViewModel.message,
        }
      : undefined;

  // TODO: fix the typing issue without additional imports
  return (
    <ConversationAGGrid
      rowData={rowData as ConversationRow[]}
      isLoading={areConversationsLoading}
      newConversationIsEnabled={!areConversationsLoading}
      handleGoToConversation={handleGoToConversation}
      handleNewConversation={handleCreateConversation}
      errorOverlayProps={errorOverlayProperties}
    />
  );
}
