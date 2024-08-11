import { z } from 'zod'
import { ConversationSchema } from '../entity/kernel-models'

export const ListConversationsRequestViewModelSchema = z.object({
    status: z.enum(['request']),
})

export type TListConversationsRequestViewModel = z.infer<typeof ListConversationsRequestViewModelSchema>

export const ListConversationsSuccessViewModelSchema = z.object({
    status: z.enum(['success']),
    conversations: z.array(ConversationSchema),
})
export type TListConversationsSuccessViewModel = z.infer<typeof ListConversationsSuccessViewModelSchema>

export const ListConversationErrorViewModelSchema = z.object({
    status: z.enum(['error']),
    message: z.string(),
    context: z.any(),
})
export type TListConversationErrorViewModel = z.infer<typeof ListConversationErrorViewModelSchema>

export const ListConversationsViewModelSchema = z.discriminatedUnion('status', [
    ListConversationsRequestViewModelSchema,
    ListConversationsSuccessViewModelSchema,
    ListConversationErrorViewModelSchema
])
export type TListConversationsViewModel = z.infer<typeof ListConversationsViewModelSchema>