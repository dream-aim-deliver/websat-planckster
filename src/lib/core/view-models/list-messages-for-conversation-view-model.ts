import { z } from 'zod'

import { MessageSchema } from '../entity/kernel-models'

export const ListMessagesForConversationRequestViewModelSchema = z.object({
    status: z.enum(['request']),
    conversationId: z.string(),
})
export type TListMessagesForConversationRequestViewModel = z.infer<typeof ListMessagesForConversationRequestViewModelSchema>

export const ListMessagesForConversationSuccessViewModelSchema = z.object({
    status: z.enum(['success']),
    messages: z.array(MessageSchema),
})

export type TListMessagesForConversationSuccessViewModel = z.infer<typeof ListMessagesForConversationSuccessViewModelSchema>

export const ListMessagesForConversationErrorViewModelSchema = z.object({
    status: z.enum(['error']),
    message: z.string(),
    context: z.any(),
})
export type TListMessagesForConversationErrorViewModel = z.infer<typeof ListMessagesForConversationErrorViewModelSchema>

export const ListMessagesForConversationViewModelSchema = z.discriminatedUnion('status', [
    ListMessagesForConversationRequestViewModelSchema,
    ListMessagesForConversationSuccessViewModelSchema,
    ListMessagesForConversationErrorViewModelSchema,
])
export type TListMessagesForConversationViewModel = z.infer<typeof ListMessagesForConversationViewModelSchema>