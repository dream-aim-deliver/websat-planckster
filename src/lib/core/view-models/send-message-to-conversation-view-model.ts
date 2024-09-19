import { z } from "zod";
import { MessageSchema } from "../entity/kernel-models";

export const SendMessageToConversationRequestViewModelSchema = z.object({
  status: z.enum(["request"]),
  conversationID: z.string(),
  message: z.string(),
});

export type TSendMessageToConversationRequestViewModel = z.infer<typeof SendMessageToConversationRequestViewModelSchema>;

export const SendMessageToConversationSuccessViewModelSchema = z.object({
  status: z.enum(["success"]),
  message: MessageSchema,
  response: MessageSchema,
});
export type TSendMessageToConversationSuccessViewModel = z.infer<typeof SendMessageToConversationSuccessViewModelSchema>;

export const SendMessageToConversationErrorViewModelSchema = z.object({
  status: z.enum(["error"]),
  message: z.string(),
  context: z.any(),
});
export type TSendMessageToConversationErrorViewModel = z.infer<typeof SendMessageToConversationErrorViewModelSchema>;

export const SendMessageToConversationProgressViewModelSchema = z.object({
  status: z.enum(["progress"]),
  message: MessageSchema,
  progressReport: z.string(),
});
export type TSendMessageToConversationProgressViewModel = z.infer<typeof SendMessageToConversationProgressViewModelSchema>;

export const SendMessageToConversationViewModelSchema = z.discriminatedUnion("status", [
  SendMessageToConversationRequestViewModelSchema,
  SendMessageToConversationSuccessViewModelSchema,
  SendMessageToConversationErrorViewModelSchema,
  SendMessageToConversationProgressViewModelSchema,
]);
export type TSendMessageToConversationViewModel = z.infer<typeof SendMessageToConversationViewModelSchema>;
