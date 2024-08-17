import { z } from "zod";
import { ConversationSchema } from "../entity/kernel-models";
export const CreateConversationRequestSchema = z.object({
    researchContextID: z.number(),
    conversationTitle: z.string(),
});
export type TCreateConversationRequest = z.infer<typeof CreateConversationRequestSchema>;

export const CreateConversationSuccessResponseSchema = z.object({
    status: z.literal("success"),
    conversation: ConversationSchema
});
export type TCreateConversationSuccessResponse = z.infer<typeof CreateConversationSuccessResponseSchema>;

export const CreateConversationErrorResponseSchema = z.object({
    status: z.literal("error"),
    operation: z.string(),
    message: z.string(),
    context: z.any().optional(),
});
export type TCreateConversationErrorResponse = z.infer<typeof CreateConversationErrorResponseSchema>;

export const CreateConversationResponseSchema = z.discriminatedUnion("status", [
    CreateConversationSuccessResponseSchema,
    CreateConversationErrorResponseSchema,
]);

export type TCreateConversationResponse = z.infer<typeof CreateConversationResponseSchema>;