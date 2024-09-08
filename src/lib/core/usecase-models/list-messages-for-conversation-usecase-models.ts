import { z } from "zod";
import { MessageSchema } from "../entity/kernel-models";

export const ListMessagesForConversationRequestSchema = z.object({
    conversationID: z.number(),
});

export type TListMessagesForConversationRequest = z.infer<typeof ListMessagesForConversationRequestSchema>;

export const ListMessagesForConversationSuccessResponseSchema = z.object({
    status: z.literal("success"),
    messages: z.array(MessageSchema),
});

export type TListMessagesForConversationSuccessResponse = z.infer<typeof ListMessagesForConversationSuccessResponseSchema>;

export const ListMessagesForConversationErrorResponseSchema = z.object({
    status: z.literal("error"),
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListMessagesForConversationErrorResponse = z.infer<typeof ListMessagesForConversationErrorResponseSchema>;

export const ListMessagesForConversationResponseSchema = z.discriminatedUnion("status", [
    ListMessagesForConversationSuccessResponseSchema,
    ListMessagesForConversationErrorResponseSchema,
]);

export type TListMessagesForConversationResponse = z.infer<typeof ListMessagesForConversationResponseSchema>;