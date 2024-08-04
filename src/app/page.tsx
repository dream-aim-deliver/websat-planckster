import { env } from "~/env";
import { redirect } from "next/navigation";
import { ListResearchContextsPage } from "./_components/list-research-contexts";
import type { ResearchContext } from "@maany_shr/kernel-planckster-sdk-ts";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS, TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";
export default async function Home() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  };
  return (
    <ListResearchContexts />
  );
}

async function ListResearchContexts() {
  const isConnected = false
  const api: TServerComponentAPI = serverContainer.get(TRPC.REACT_SERVER_COMPONENTS_API);

  let researchContexts: ResearchContext[] = [];

  if (isConnected) {
    researchContexts = await api.kernel.researchContext.list(
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