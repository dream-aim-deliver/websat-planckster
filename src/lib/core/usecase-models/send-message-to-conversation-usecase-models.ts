import { z } from "zod";
import { MessageSchema } from "../entity/kernel-models";

export const SendMessageToConversationRequestSchema = z.object({
  status: z.literal("request"),
  researchContextExternalID: z.string(),
  conversationID: z.number(),
  messageToSendContent: z.string(),
  messageToSendTimestamp: z.string(),
  messageToSendAdditionalContext: z.string().optional(),
});

export type TSendMessageToConversationRequest = z.infer<typeof SendMessageToConversationRequestSchema>;

export const SendMessageToConversationSuccessResponseSchema = z.object({
  status: z.literal("success"),
  message: MessageSchema,
  response: MessageSchema,
});
export type TSendMessageToConversationSuccessResponse = z.infer<typeof SendMessageToConversationSuccessResponseSchema>;

export const SendMessageToConversationErrorResponseSchema = z.object({
  status: z.literal("error"),
  operation: z.string(),
  message: z.string(),
  context: z.any().optional(),
});
export type TSendMessageToConversationErrorResponse = z.infer<typeof SendMessageToConversationErrorResponseSchema>;

export const SendMessageToConversationProgressResponseSchema = z.object({
  status: z.literal("progress"),
  message: MessageSchema,
  progress: z.string(),
  context: z.any().optional(),
});
export type TSendMessageToConversationProgressResponse = z.infer<typeof SendMessageToConversationProgressResponseSchema>;

export const SendMessageToConversationResponseSchema = z.discriminatedUnion("status", [SendMessageToConversationSuccessResponseSchema, SendMessageToConversationErrorResponseSchema, SendMessageToConversationProgressResponseSchema]);
export type TSendMessageToConversationResponse = z.infer<typeof SendMessageToConversationResponseSchema>;
