import { type TMessage, type TMessageContent } from "~/lib/core/entity/kernel-models";
import { type MessageBase_Input, type MessageContent } from "@maany_shr/kernel-planckster-sdk-ts";


export const kernelMessageContentToWebsatMessageContent = (kernelMessageContent: MessageContent): TMessageContent => {
    return {
        id: kernelMessageContent.id,
        content: kernelMessageContent.content,
        content_type: kernelMessageContent.content_type
    }
};

export const kernelMessageToWebsatMessage = (kernelMessage: MessageBase_Input): TMessage => {
    
    return {
        id: kernelMessage.id,
        message_contents: kernelMessage.message_contents.map(kernelMessageContentToWebsatMessageContent),
        created_at: kernelMessage.created_at,
        sender: kernelMessage.sender,
        sender_type: kernelMessage.sender_type,
        thread_id: kernelMessage.thread_id
    }
};