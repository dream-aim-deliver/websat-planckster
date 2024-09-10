"use client";
import { ListResearchContextCard, ResearchContextCard, CreateResearchContextDialog } from "@maany_shr/rage-ui-kit";
import { ResearchContextPage } from "@maany_shr/planckster-ui-kit";
import { type ResearchContext } from "node_modules/@maany_shr/kernel-planckster-sdk-ts";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import type { TClientComponentAPI } from "~/lib/infrastructure/client/trpc/react-api";
import { CONTROLLERS, TRPC } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import {TCreateResearchContextsViewModel} from "~/lib/core/view-models/create-research-contexts-view-models";
import { useState } from "react";
import { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { Signal } from "~/lib/core/entity/signals";
import BrowserListResearchContextsController, { TBrowserListResearchContextsControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-research-contexts-controller";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import { useRouter } from "next/navigation";
import BrowserListSourceDataController, { TBrowserListSourceDataControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";

export function ListResearchContextsClientPage(props: { viewModel: TListResearchContextsViewModel }) {
  const [listResearchContextsViewModel, setListResearchContextsViewModel] = useState<TListResearchContextsViewModel>(props.viewModel);
  const [createResearchContextsViewModel, setCreateResearchContextsViewModel] = useState<TCreateResearchContextsViewModel>(props.viewModel);
  const [listSourceDataViewModel, setListSourceDataViewModel] = useState<TListSourceDataViewModel>(props.viewModel);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { isFetching, isLoading, isError } = useQuery<Signal<TListResearchContextsViewModel>>({
    queryKey: ["list-research-contexts"],
    queryFn: async () => {
      const signalFactory = signalsContainer.get<(initialValue: TListResearchContextsViewModel, update?: (value: TListResearchContextsViewModel) => void) => Signal<TListResearchContextsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_RESEARCH_CONTEXTS);
      const response: Signal<TListResearchContextsViewModel> = signalFactory(
        {
          status: "request",
        },
        setListResearchContextsViewModel,
      );
      const controllerParameters: TBrowserListResearchContextsControllerParameters = {
        response: response,
      };
      const controller = clientContainer.get<BrowserListResearchContextsController>(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  const listSourceDataQuery = useQuery<Signal<TListSourceDataViewModel>>({
    queryKey: ["list-source-data"],
    queryFn: async () => {
      const signalFactory = signalsContainer.get<(initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => Signal<TListSourceDataViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA);
      const response: Signal<TListSourceDataViewModel> = signalFactory(
        {
          status: "request",
        },
        setListSourceDataViewModel,
      );
      const controllerParameters: TBrowserListSourceDataControllerParameters = {
        response: response,
      };
      const controller = clientContainer.get<BrowserListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });
  // if (listResearchContextsViewModel.status === "request") {
  //   return (
  //     <div>
  //       <ListResearchContextCard items={listResearchContextsViewModel.researchContexts} />
  //     </div>
  //   );
  // } else 
  if (listResearchContextsViewModel.status === "success" && listSourceDataViewModel.status === "success") {
    const cards = listResearchContextsViewModel.researchContexts.map((researchContext) => {
      return {
        callbacks: {
          onNavigateToListConversationPage: () => {router.push(`/${researchContext.id}/conversations`)},
          onNavigateToSourcesPage: () => {router.push(`/${researchContext.id}/sources`)},
        },
        description: researchContext.description,
        id: researchContext.id,
        title: researchContext.title,
      }
    });
    return (
      <div>
        <ListResearchContextCard items={cards} />
        <div>
        <CreateResearchContextDialog
          clientFiles={listSourceDataViewModel.sourceData}
          onSubmit={() => {
            queryClient.invalidateQueries({ queryKey: ["list-research-contexts"] });
          }}
          viewModel={createResearchContextsViewModel}
        />
        </div>
      </div>
    );
  }
}

// export type ListResearchContextsPageProps = {
//   researchContexts: ResearchContext[];
//   kernelPlancksterHost: string;
// };

// export function ListResearchContextsPage(props: ListResearchContextsPageProps) {
//   const api = clientContainer.get<TClientComponentAPI>(
//     TRPC.REACT_CLIENT_COMPONENTS_API,
//   );
//   const addNewContextMutation = api.kernel.researchContext.create.useMutation({
//     onSuccess: () => {
//       // TODO: handle success
//       console.log("Context created");
//     },
//   });

//   return (
//     <div>
//       <button disabled={false} />
//       {addNewContextMutation.isError && (
//         <div>Error: {addNewContextMutation.error.message}</div>
//       )}
//       <ResearchContextPage
//         cards={props.researchContexts}
//         onAddContextClick={() => {
//           addNewContextMutation.mutate({
//             title: "New Context",
//             description: "New Context Description",
//             sourceDataIdList: [1, 2, 3],
//           });
//         }}
//         apiUrl={props.kernelPlancksterHost}
//       />
//     </div>
//   );
// }
