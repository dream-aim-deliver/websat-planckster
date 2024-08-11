import { z } from "zod";
import { MessageSchema } from "../entity/kernel-models";

export const ListMessagesForConversationRequestSchema = z.object({
    clientID: z.string(),
    conversationID: z.string(),
});

export type TListMessagesForConversationRequest = z.infer<typeof ListMessagesForConversationRequestSchema>;

export const ListMessagesForConversationSuccessResponseSchema = z.object({
    messages: z.array(MessageSchema),
});

export type TListMessagesForConversationSuccessResponse = z.infer<typeof ListMessagesForConversationSuccessResponseSchema>;

export const ListMessagesForConversationErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListMessagesForConversationErrorResponse = z.infer<typeof ListMessagesForConversationErrorResponseSchema>;
