import { z } from 'zod'
import { MessageSchema } from '../entity/kernel-models'

export const SendMessageToConversationRequestSchema = z.object({
    clientID: z.string(),
    researchContextID: z.string(),
    conversationID: z.string(),
    message: z.string(),
})

export type TSendMessageToConversationRequest = z.infer<typeof SendMessageToConversationRequestSchema>

export const SendMessageToConversationSuccessResponseSchema = z.object({
    message: MessageSchema,
    response: MessageSchema,
})
export type TSendMessageToConversationSuccessResponse = z.infer<typeof SendMessageToConversationSuccessResponseSchema>

export const SendMessageToConversationErrorResponseSchema = z.object({
    operation: z.string(),
    message: z.string(),
    context: z.any(),
})
export type TSendMessageToConversationErrorResponse = z.infer<typeof SendMessageToConversationErrorResponseSchema>

export const SendMessageToConversationProgressResponseSchema = z.object({
    message: MessageSchema,
    progress: z.string(),
})
export type TSendMessageToConversationProgressResponse = z.infer<typeof SendMessageToConversationProgressResponseSchema>
