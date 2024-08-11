import { z } from "zod";

export const ListMessagesForConversationRequestSchema = z.object({
    clientID: z.string(),
    researchContextID: z.string(),
    conversationID: z.string(),
});

export type TListMessagesForConversationRequest = z.infer<typeof ListMessagesForConversationRequestSchema>;

export const ListMessagesForConversationSuccessResponseSchema = z.object({
    messages: z.array(z.object({
        message_id: z.number(),
        conversation_id: z.number(),
        message: z.string(),
        created_at: z.string(),
    })),
});

export type TListMessagesForConversationSuccessResponse = z.infer<typeof ListMessagesForConversationSuccessResponseSchema>;

export const ListMessagesForConversationErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListMessagesForConversationErrorResponse = z.infer<typeof ListMessagesForConversationErrorResponseSchema>;
