import { env } from "~/env";
import { redirect } from "next/navigation";
import { ListResearchContextsPage } from "./_components/list-research-contexts";
import type { ResearchContext } from "@maany_shr/kernel-planckster-sdk-ts";
import { getServerAuthSession } from "~/lib/server/auth";
import { api } from "~/lib/server/infrastructure/config/trpc/server";
export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
    <ListResearchContexts />
  );
}

async function ListResearchContexts() {
  const isConnected = false
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  let researchContexts: ResearchContext[] = [];

  if (isConnected) {
    researchContexts = await api.researchContext.list(
      { id: env.KP_CLIENT_ID, xAuthToken: env.KP_AUTH_TOKEN },
    );
  }

  return (
    <div>
      <ListResearchContextsPage researchContexts={researchContexts}
        kernelPlancksterHost={env.KP_HOST}
      />
    </div>
  );
}