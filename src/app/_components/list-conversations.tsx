"use client";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { useState } from "react";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import type { Signal } from "~/lib/core/entity/signals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type BrowserListConversationsController from "~/lib/infrastructure/client/controller/browser-list-conversations-controller";
import type { TBrowserListConversationsControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-conversations-controller";
import type { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";
import type BrowserCreateConversationController from "~/lib/infrastructure/client/controller/browser-create-conversation-controller";
import type { TBrowserCreateConversationControllerParameters } from "~/lib/infrastructure/client/controller/browser-create-conversation-controller";
import { ConversationAGGrid } from '@maany_shr/rage-ui-kit';
import { useRouter } from "next/navigation";
import { type ConversationRow } from "node_modules/@maany_shr/rage-ui-kit/dist/components/table/ConversationAGGrid";


export function ListConversationsClientPage(props: { viewModel: TListConversationsViewModel; researchContextID: number }) {

  const [listConversationsViewModel, setListConversationsViewModel] = useState<TListConversationsViewModel>(props.viewModel);

  const [createConversationViewModel, setCreateConversationViewModel] = useState<TCreateConversationViewModel>({
    status: "request",
  } as TCreateConversationViewModel);

  const queryClient = useQueryClient();

  const { isFetching, isLoading, isError } = useQuery<Signal<TListConversationsViewModel>>({
    queryKey: [`list-conversations#${props.researchContextID}`],
    queryFn: async () => {
      const signalFactory = signalsContainer.get<(initialValue: TListConversationsViewModel, update?: (value: TListConversationsViewModel) => void) => Signal<TListConversationsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS);
      const response: Signal<TListConversationsViewModel> = signalFactory(
        {
          status: "request",
        },
        setListConversationsViewModel,
      );
      const controllerParameters: TBrowserListConversationsControllerParameters = {
        response: response,
        researchContextID: props.researchContextID,
      };
      const controller = clientContainer.get<BrowserListConversationsController>(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  const enableCreateConversation = !isFetching || !isLoading;

  const mutation = useMutation({
    mutationKey: ["create-conversation"],
    retry: 3,
    retryDelay: 3000,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({queryKey: [`list-conversations#${props.researchContextID}`]});
    },
    mutationFn: async (title: string) => {
      const signalFactory = signalsContainer.get<(initialValue: TCreateConversationViewModel, update?: (value: TCreateConversationViewModel) => void) => Signal<TCreateConversationViewModel>>(SIGNAL_FACTORY.KERNEL_CREATE_CONVERSATION);
      const response: Signal<TCreateConversationViewModel> = signalFactory(
        {
          status: "request",
        } as TCreateConversationViewModel,
        setCreateConversationViewModel,
      );
      const controller = clientContainer.get<BrowserCreateConversationController>(CONTROLLERS.CREATE_CONVERSATION_CONTROLLER);
      const controllerParameters: TBrowserCreateConversationControllerParameters = {
        response: response,
        researchContextID: props.researchContextID,
        title: title,
      };
      await controller.execute(controllerParameters);
    },
  });

  const handleCreateConversation = (title: string) => {
    console.log("Creating conversation with title: ", title);
    mutation.mutate(title);
  };

  const router = useRouter();

  const handleGoToConversation = (conversationID: number) => {
    console.log("Going to conversation with ID: ", conversationID);
    router.push(`${props.researchContextID}/conversations/${conversationID}`);
  }

  if (listConversationsViewModel.status === "success") {
    return <ConversationAGGrid
        isLoading={isFetching || isLoading}
        rowData={listConversationsViewModel.conversations as ConversationRow[]}
        handleGoToConversation={handleGoToConversation}
        handleNewConversation={handleCreateConversation}
        newConversationIsEnabled={enableCreateConversation}
    />;
  } else {
    return <ConversationAGGrid
        isLoading={false}
        rowData={[]}
        handleGoToConversation={handleGoToConversation}
        handleNewConversation={handleCreateConversation}
        newConversationIsEnabled={enableCreateConversation}
        errorOverlayProps={{
          errorStatus: true,
          overlayText: `Error: ${JSON.stringify(listConversationsViewModel)}`,
        }}
    />;
  }
}
