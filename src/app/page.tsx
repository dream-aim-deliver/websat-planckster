import { redirect } from "next/navigation";
import { ListResearchContextsPage } from "./_components/list-research-contexts";
import type { ResearchContext } from "@maany_shr/kernel-planckster-sdk-ts";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import {
  GATEWAYS,
  TRPC,
} from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";
import env from "~/lib/infrastructure/server/config/env";
import { Menu } from "./_components/layouts/menu";

export default async function ListResearchContexts() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }
  const kpCredentialsDTO = await authGateway.extractKPCredentials();
  const api: TServerComponentAPI = serverContainer.get(
    TRPC.REACT_SERVER_COMPONENTS_API,
  );
  const isConnected = await api.kernel.healthCheck.ping({});
  const isAuthorizedKPUser = kpCredentialsDTO.success;
  // let researchContexts: ResearchContext[] = [];

  // if (isConnected && isAuthorizedKPUser) {
  //   researchContexts = await api.kernel.researchContext.list();
  // }

  return (
    <div className="flex">
      <Menu/>
      {/*<ListResearchContextsPage
        researchContexts={researchContexts}
        kernelPlancksterHost={env.KP_HOST! as string}
      />*/}
    </div>
  );
}
