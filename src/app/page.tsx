import { env } from "~/env";
import { redirect } from "next/navigation";
import { ListResearchContextsPage } from "./_components/list-research-contexts";
import type { ResearchContext } from "@maany_shr/kernel-planckster-sdk-ts";
import { api } from "~/lib/infrastructure/trpc/server";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
export default async function Home() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const session = await authGateway.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
    <ListResearchContexts />
  );
}

async function ListResearchContexts() {
  const isConnected = false
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