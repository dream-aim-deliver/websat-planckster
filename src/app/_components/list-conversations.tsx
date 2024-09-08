"use client";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import { useState } from "react";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import type { Signal } from "~/lib/core/entity/signals";
import { useQuery } from "@tanstack/react-query";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type BrowserListConversationsController from "~/lib/infrastructure/client/controller/browser-list-conversations-controller";
import type { TBrowserListConversationsControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-conversations-controller";

// TODO: look at one of the ralph pages
export function ListConversationsClientPage(props: { viewModel: TListConversationsViewModel; researchContextID: number }) {
  const [listConversationsViewModel, setListConversationsViewModel] = useState<TListConversationsViewModel>(props.viewModel);

  const { isFetching, isLoading, isError } = useQuery<Signal<TListConversationsViewModel>>({
    queryKey: [`list-conversations#${props.researchContextID}`],
    queryFn: async () => {
      const signalFactory = signalsContainer.get<(initialValue: TListConversationsViewModel, update?: (value: TListConversationsViewModel) => void) => Signal<TListConversationsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS);
      const response: Signal<TListConversationsViewModel> = signalFactory({
        status: "request",
      }, setListConversationsViewModel);
      const controllerParameters: TBrowserListConversationsControllerParameters = {
        response: response,
        researchContextID: props.researchContextID,
      };
      const controller = clientContainer.get<BrowserListConversationsController>(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  if (isFetching || isLoading) {
    return <div>Loading State of Table Component. Disable the create new conversation button and show a spinner somewhere</div>;
  }
  if(isError){
    return <div>Error State of Table Component. Use a toast to show we cannot fetch data anymore.</div>
  }
  if (listConversationsViewModel.status === "error") {
    return <div>Error VM: {JSON.stringify(listConversationsViewModel)}</div>;
  } else if (listConversationsViewModel.status === "success") {
    return <div><ul>
      {listConversationsViewModel.conversations.map((conversation) => {
        return <li key={conversation.id}>{conversation.title}</li>;
      })}
      </ul></div>;
  }
}
