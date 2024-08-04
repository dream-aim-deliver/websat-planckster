"use client";

import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import type { TClientComponentAPI } from "~/lib/infrastructure/client/trpc/react-api";
import { TRPC } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";

export type DummySendMessageProps = {
    conversationId: number,
    xAuthToken: string,
    messageContent: string,
}

export function DummySendMessage(
    props: DummySendMessageProps
) {
    const api = clientContainer.get<TClientComponentAPI>(TRPC.REACT_CLIENT_COMPONENTS_API);
    const sendMessageMutation = api.kernel.message.create.useMutation({
        onSuccess: () => {
            console.log("Message sent");
        },
    });

    return (
        <div>
            <button
                onClick={() => {
                    sendMessageMutation.mutate({
                        conversationId: props.conversationId,
                        xAuthToken: props.xAuthToken,
                        messageContent: props.messageContent,
                    });
                }}
            >
                Send Message
            </button>
            {sendMessageMutation.isError && (
                <div>Error: {JSON.stringify(sendMessageMutation.error)}</div>
            )}
        </div>
    );
}