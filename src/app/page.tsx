import { redirect } from "next/navigation";
import { ListResearchContextsPage } from "./_components/list-research-contexts";
import type { ResearchContext } from "@maany_shr/kernel-planckster-sdk-ts";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import env from "~/lib/infrastructure/server/config/env";

export default async function ListResearchContexts() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  const topics: ResearchContext[] = [
    {
      created_at: "2024-01-01T00:00:00.000Z",
      id: 1,
      title: "Topic 1",
      updated_at: "2024-01-01T00:00:00.000Z",
      deleted_at: null,
      deleted: false,
      description: "Description of Topic 1",
    },
    {
      created_at: "2024-01-01T00:00:00.000Z",
      id: 2,
      title: "Topic 2",
      updated_at: "2024-01-01T00:00:00.000Z",
      deleted_at: null,
      deleted: false,
      description: "Description of Topic 2",
    },
    {
      created_at: "2024-01-01T00:00:00.000Z",
      id: 3,
      title: "Topic 3",
      updated_at: "2024-01-01T00:00:00.000Z",
      deleted_at: null,
      deleted: false,
      description: "Description of Topic 3",
    }
  ];
  
  return (
    <div className="flex">
      <ListResearchContextsPage researchContexts={topics} kernelPlancksterHost={env.KP_HOST! as string} />
    </div>
  );
}
