"use client";
import { ListResearchContextCard, CreateResearchContextDialog, type ResearchContextCardProps } from "@maany_shr/rage-ui-kit";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type { TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import type { TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import type { Signal } from "~/lib/core/entity/signals";
import type BrowserListResearchContextsController from "~/lib/infrastructure/client/controller/browser-list-research-contexts-controller";
import { type TBrowserListResearchContextsControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-research-contexts-controller";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import { useRouter } from "next/navigation";
import type BrowserCreateResearchContextController from "~/lib/infrastructure/client/controller/browser-create-research-context-controller";
import type { SelectableSourceDataRow } from "node_modules/@maany_shr/rage-ui-kit/dist/components/table/SelectableSourceDataAGGrid";
import type { RemoteFile } from "~/lib/core/entity/file";

export function ListResearchContextsClientPage(props: {
  viewModel: TListResearchContextsViewModel;
  clientSourceData: RemoteFile[]
}) {
  const [listResearchContextsViewModel, setListResearchContextsViewModel] = useState<TListResearchContextsViewModel>(props.viewModel);
  const [createResearchContextsViewModel, setCreateResearchContextsViewModel] = useState<TCreateResearchContextViewModel>({
    status: "request",
  } as TCreateResearchContextViewModel);

  const router = useRouter();
  const queryClient = useQueryClient();

  const listResearchContextsQuery = useQuery<Signal<TListResearchContextsViewModel>>({
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

  const createResearchContextMutation = useMutation({
    mutationKey: ["create-research-context"],
    retry: 3,
    retryDelay: 3000,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["list-research-contexts"] });
    },
    mutationFn: async (request: { title: string; description: string; sourceData: SelectableSourceDataRow[] }) => {
      const createResearchContextController = clientContainer.get<BrowserCreateResearchContextController>(CONTROLLERS.CREATE_RESEARCH_CONTEXT_CONTROLLER);
      const signalFactory = signalsContainer.get<(initialValue: TCreateResearchContextViewModel, update?: (value: TCreateResearchContextViewModel) => void) => Signal<TCreateResearchContextViewModel>>(SIGNAL_FACTORY.CREATE_RESEARCH_CONTEXT);
      const response = signalFactory(
        {
          status: "request",
          researchContextName: request.title,
        } as TCreateResearchContextViewModel,
        setCreateResearchContextsViewModel,
      );

      const controllerParameters = {
        response: response,
        title: request.title,
        description: request.description,
        sourceDataList: request.sourceData.map((sourceData) => {
          return {
            id: sourceData.id,
            name: sourceData.name,
            relativePath: sourceData.relativePath,
            createdAt: sourceData.createdAt,
            provider: "kernel#s3",
            type: "remote" as const,
          };
        }),
      };
      await createResearchContextController.execute(controllerParameters);
    },
  });

  let cards: ResearchContextCardProps[] = [];
  if (listResearchContextsViewModel.status === "success" && listResearchContextsViewModel.status === "success") {
    cards = listResearchContextsViewModel.researchContexts.map((researchContext) => {
      return {
        callbacks: {
          onNavigateToListConversationPage: () => {
            router.push(`/${researchContext.id}/conversations`);
          },
          onNavigateToSourcesPage: () => {
            router.push(`/${researchContext.id}/sources`);
          },
        },
        description: researchContext.description,
        id: researchContext.id,
        title: researchContext.title,
      };
    });
  }

  if (listResearchContextsViewModel.status === "request") {
    return (
      <div>
        Loading...
      </div>
    );
  }
  return (
    <div className="">
      <ListResearchContextCard items={cards} />
      <div className="fixed bottom-0 right-0">
        <CreateResearchContextDialog
          clientFiles={props.clientSourceData}
          onSubmit={(researchContextName: string, researchContextDescription: string, sourceData: SelectableSourceDataRow[]) => {
            createResearchContextMutation.mutate({
              title: researchContextName,
              description: researchContextDescription,
              sourceData: sourceData,
            });
          }}
          viewModel={createResearchContextsViewModel}
        />
      </div>
    </div>
  );
}

