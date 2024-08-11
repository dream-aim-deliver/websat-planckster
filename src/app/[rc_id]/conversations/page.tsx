import env from "~/lib/infrastructure/server/config/env";
import { redirect } from "next/navigation";
import { ListConversationsPage } from "../../_components/list-conversations";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS, TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";

export default async function Home({ params }: { params: { rc_id: string } }) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }
  return <ListConversations rc_id={params.rc_id} />;
}

async function ListConversations({ rc_id }: { rc_id: string }) {
  const api: TServerComponentAPI = serverContainer.get(TRPC.REACT_SERVER_COMPONENTS_API);
  const rc_id_int = parseInt(rc_id);
  const conversations = await api.kernel.conversation.list({
    researchContextID: rc_id_int,
  });

  return (
    <div></div>
    // <ListConversationsPage
      // conversations={conversations.data}
      // kernelPlancksterHost={env.KP_HOST! as string}
    // />
  );
}
