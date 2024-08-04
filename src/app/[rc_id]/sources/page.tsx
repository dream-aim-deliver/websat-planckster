import { env } from "~/env";
import { redirect } from "next/navigation";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS, TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";

export default async function Home(
    { params }: { params: { rc_id: string } }
) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const session = await authGateway.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
        <ListSourceData rc_id={params.rc_id} />
  );
}

async function ListSourceData({ rc_id }: { rc_id: string }) {
  const api: TServerComponentAPI = serverContainer.get(TRPC.REACT_SERVER_COMPONENTS_API);
  const rc_id_int = parseInt(rc_id);
  
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const session = await authGateway.getSession();
  if (!session?.user) return null;
  
  const sourceData = await api.kernel.sourceData.listForResearchContext(
    {
        researchContextId: rc_id_int,
        xAuthToken: env.KP_AUTH_TOKEN
    }
  )

  // Return a simple HTML unordered list
  return (
   <ul>
    {sourceData.map((data, index) => (
      <li key={index}>
        {data.relative_path}
      </li>
    ))}
  </ul>   

  );


}