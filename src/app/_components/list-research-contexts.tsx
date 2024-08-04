"use client";
import { ResearchContextPage } from "@maany_shr/planckster-ui-kit";
import { type ResearchContext } from "node_modules/@maany_shr/kernel-planckster-sdk-ts";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import type { TClientComponentAPI } from "~/lib/infrastructure/client/trpc/react-api";
import { TRPC } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";

export type ListResearchContextsPageProps = {
  researchContexts: ResearchContext[];
  kernelPlancksterHost: string;
};

export function ListResearchContextsPage(props: ListResearchContextsPageProps) {
  const api = clientContainer.get<TClientComponentAPI>(
    TRPC.REACT_CLIENT_COMPONENTS_API,
  );
  const addNewContextMutation = api.kernel.researchContext.create.useMutation({
    onSuccess: () => {
      // TODO: handle success
      console.log("Context created");
    },
  });

  return (
    <div>
      <button disabled={false} />
      {addNewContextMutation.isError && (
        <div>Error: {addNewContextMutation.error.message}</div>
      )}
      <ResearchContextPage
        cards={props.researchContexts}
        onAddContextClick={() => {
          addNewContextMutation.mutate({
            title: "New Context",
            description: "New Context Description",
            sourceDataIdList: [1, 2, 3],
          });
        }}
        apiUrl={props.kernelPlancksterHost}
      />
    </div>
  );
}
