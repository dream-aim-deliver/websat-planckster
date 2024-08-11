import { z } from "zod";
export const CreateConversationRequestSchema = z.object({
    clientID: z.string(),
    researchContextID: z.string(),
    title: z.string(),
});
export type TCreateConversationRequest = z.infer<typeof CreateConversationRequestSchema>;

export const CreateConversationSuccessResponseSchema = z.object({
    conversation_id: z.number(),
});
export type TCreateConversationSuccessResponse = z.infer<typeof CreateConversationSuccessResponseSchema>;

export const CreateConversationErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});
export type TCreateConversationErrorResponse = z.infer<typeof CreateConversationErrorResponseSchema>;
