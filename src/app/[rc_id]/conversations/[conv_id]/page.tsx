import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";

import { ListMessagesPage } from "../../../_components/list-messages";
import type { ChatMessageProps } from "@maany_shr/planckster-ui-kit";
import { DummySendMessage } from "~/app/_components/dummy-send-message";

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
        { conversationId: conv_id_int, xAuthToken: env.KP_AUTH_TOKEN },
    );

    //const cmProps: ChatMessageProps[] = []

    //for (const message of messages) {

        //const role = message.sender_type === "user" ? "user" : "llm"

        //const cmProp: ChatMessageProps = {
            //senderName: message.sender,
            //message: message.content,
            //sentTime: message.timestamp,
            //role: role
        //}

        //cmProps.push(cmProp)
    //}
            //<ListMessagesPage chatMessageProps={cmProps}
             ///>

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                <li key={index}>
                    {`sender: ${msg.sender} ::: content: ${msg.content}`}
                </li>
                ))}
            </ul>   
            <DummySendMessage
                conversationId={conv_id_int}
                xAuthToken={env.KP_AUTH_TOKEN}
                messageContent="This is a hard-coded test message from websat planckster. Now greet me"
            />
        </div>
    );


}