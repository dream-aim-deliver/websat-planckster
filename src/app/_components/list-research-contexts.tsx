"use client";
import { ResearchContextPage } from "@maany_shr/planckster-ui-kit";
import { type ResearchContext } from "node_modules/@maany_shr/kernel-planckster-sdk-ts";
import { api } from "~/trpc/react";

export type ListResearchContextsPageProps = {
  researchContexts: ResearchContext[];
  kernelPlancksterHost: string;
};
 const IdiotPage = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      {children}
    </div>
  )
 }
export function ListResearchContextsPage(props: ListResearchContextsPageProps) {
  const addNewContextMutation = api.researchContext.create.useMutation({
    onSuccess: () => {
      // TODO: handle success
      console.log("Context created");
    },
  });

  const MySecyButton = (<button
    
  >Sexy</button>)
  return (
    <div>
      <IdiotPage>
        {MySecyButton}
      </IdiotPage>
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
