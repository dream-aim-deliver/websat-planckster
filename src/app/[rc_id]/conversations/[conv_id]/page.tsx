import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";
import { ListMessagesPage } from "../../../_components/list-messages";
import type { ChatMessageProps, ChatPageProps } from "@maany_shr/planckster-ui-kit";

export default async function Home(
    { params }: { params: { conv_id: string } }
) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/login");
  };
  return (
        <ListMessages conv_id={params.conv_id} />
  );
}

async function ListMessages({ conv_id }: { conv_id: string }) {

    const conv_id_int = parseInt(conv_id);

    const session = await getServerAuthSession();
    if (!session?.user) return null;

    const messages = await api.message.list(
        { id: conv_id_int, xAuthToken: env.KP_AUTH_TOKEN },
    );

    // TODO: convert here individual messages to chatMessageProp, need a Message model in the sdk
    const cmProps: ChatMessageProps = {

    }

    const props: ChatPageProps = {
        chatMessageProps = cmProps
    }

    return (
        <ListMessagesPage chatMessageProps={props}
        />
    );


}