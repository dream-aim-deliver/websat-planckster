import { env } from "~/env";
import { redirect } from "next/navigation";

import { DummySendMessage } from "~/app/_components/dummy-send-message";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { GATEWAYS, TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";

export default async function Home({
  params,
}: {
  params: { conv_id: string };
}) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const session = await authGateway.getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return <ListMessages conv_id={params.conv_id} />;
}

async function ListMessages({ conv_id }: { conv_id: string }) {
  const api: TServerComponentAPI = serverContainer.get(TRPC.REACT_SERVER_COMPONENTS_API);
  const conv_id_int = parseInt(conv_id);
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const session = await authGateway.getSession();
  if (!session?.user) return null;

  const messages = await api.kernel.message.list({
    conversationId: conv_id_int,
    xAuthToken: env.KP_AUTH_TOKEN,
  });

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
