"use client";

import { api } from "~/lib/infrastructure/client/trpc/react";

export type DummySendMessageProps = {
    conversationId: number,
    xAuthToken: string,
    messageContent: string,
}

export function DummySendMessage(
    props: DummySendMessageProps
) {
    const sendMessageMutation = api.message.create.useMutation({
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