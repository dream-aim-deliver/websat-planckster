import { z } from "zod";
import { ConversationSchema } from "../entity/kernel-models";

export const ListConversationsRequestSchema = z.object({
    researchContextID: z.number(),
});

export type TListConversationsRequest = z.infer<typeof ListConversationsRequestSchema>;

export const ListConversationsSuccessResponseSchema = z.object({
    status: z.literal("success"),
    conversations: z.array(ConversationSchema),
});

export type TListConversationsSuccessResponse = z.infer<typeof ListConversationsSuccessResponseSchema>;

export const ListConversationsErrorResponseSchema = z.object({
    status: z.literal("error"),
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListConversationsErrorResponse = z.infer<typeof ListConversationsErrorResponseSchema>;

export const ListConversationsResponseSchema = z.discriminatedUnion("status", [
    ListConversationsSuccessResponseSchema,
    ListConversationsErrorResponseSchema,
]);

export type TListConversationsResponse = z.infer<typeof ListConversationsResponseSchema>;