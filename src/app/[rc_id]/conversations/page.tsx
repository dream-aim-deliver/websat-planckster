import { env } from "~/env";
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
  const session = await authGateway.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return <ListConversations rc_id={params.rc_id} />;
}

async function ListConversations({ rc_id }: { rc_id: string }) {
  const api: TServerComponentAPI = serverContainer.get(TRPC.REACT_SERVER_COMPONENTS_API);
  const rc_id_int = parseInt(rc_id);
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const session = await authGateway.getSession();
  if (!session?.user) return null;

  const conversations = await api.kernel.conversation.list({
    id: rc_id_int,
    xAuthToken: env.KP_AUTH_TOKEN,
  });

  return (
    <ListConversationsPage
      conversations={conversations}
      kernelPlancksterHost={env.KP_HOST}
    />
  );
}
