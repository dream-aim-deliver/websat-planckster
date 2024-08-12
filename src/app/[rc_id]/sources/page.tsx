import { redirect } from "next/navigation";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS, TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";

export default async function Home(
    { params }: { params: { rc_id: string } }
) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  };
  return (
        <ListSourceData rc_id={params.rc_id} />
  );
}

async function ListSourceData({ rc_id }: { rc_id: string }) {
  const api: TServerComponentAPI = serverContainer.get(TRPC.REACT_SERVER_COMPONENTS_API);
  const rc_id_int = parseInt(rc_id);
  
  const sourceDataDTO = await api.kernel.sourceData.listForResearchContext(
    {
        researchContextId: rc_id_int,
    }
  )

  if (!sourceDataDTO.success) {
    return <div>Error: {sourceDataDTO.data.message}</div>;
  }

  const sourceData = sourceDataDTO.data

  // Return a simple HTML unordered list
  return (
   <ul>
    {sourceData.map((data, index) => (
      <li key={index}>
        {data.relativePath}
      </li>
    ))}
  </ul>   

  );


}