import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";
import { ListConversationsPage } from "../../_components/list-conversations";

export default async function Home(
    { params }: { params: { rc_id: string } }
) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
        <ListConversations rc_id={params.rc_id} />
  );
}

async function ListConversations({ rc_id }: { rc_id: string }) {

  const rc_id_int = parseInt(rc_id);
  
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const conversations = await api.conversation.list(
    { id: rc_id_int, xAuthToken: env.KP_AUTH_TOKEN },
  );

  return (
    <ListConversationsPage conversations={conversations}
    kernelPlancksterHost={env.KP_HOST}
     />
  );
}