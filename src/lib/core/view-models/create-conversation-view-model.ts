import { z } from "zod";
import { ConversationSchema } from "../entity/kernel-models";


export const CreateConversationRequestViewModelSchema = z.object({
    status: z.enum(["request"]),
    conversationTitle: z.string(),
});

export type TCreateConversationRequestViewModel = z.infer<typeof CreateConversationRequestViewModelSchema>;

export const CreateConversationSuccessViewModelSchema = z.object({
    status: z.enum(["success"]),
    conversation: ConversationSchema,
});
export type TCreateConversationSuccessViewModel = z.infer<typeof CreateConversationSuccessViewModelSchema>;

export const CreateConversationErrorViewModelSchema = z.object({
    status: z.enum(["error"]),
    message: z.string(),
    context: z.any(),
});
export type TCreateConversationErrorViewModel = z.infer<typeof CreateConversationErrorViewModelSchema>;

export const CreateConversationViewModelSchema = z.discriminatedUnion("status", [
    CreateConversationRequestViewModelSchema,
    CreateConversationSuccessViewModelSchema,
    CreateConversationErrorViewModelSchema
]);
export type TCreateConversationViewModel = z.infer<typeof CreateConversationViewModelSchema>;
