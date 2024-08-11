import { z } from "zod";
import { ConversationSchema } from "../entity/kernel-models";

export const ListConversationsRequestSchema = z.object({
    clientID: z.string(),
    researchContextID: z.string(),
});

export type TListConversationsRequest = z.infer<typeof ListConversationsRequestSchema>;

export const ListConversationsSuccessResponseSchema = z.object({
    conversations: z.array(ConversationSchema),
});

export type TListConversationsSuccessResponse = z.infer<typeof ListConversationsSuccessResponseSchema>;

export const ListConversationsErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});

export type TListConversationsErrorResponse = z.infer<typeof ListConversationsErrorResponseSchema>;

