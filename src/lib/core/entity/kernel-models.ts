import { z } from "zod";

export const ResearchContextSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});
export type TResearchContext = z.infer<typeof ResearchContextSchema>;

export const ConversationSchema = z.object({
    id: z.number(),
    title: z.string(),
});
export type TConversation = z.infer<typeof ConversationSchema>;


export const BaseMessageSchema = z.object({
    id: z.number(),
    content: z.string(),
    timestamp: z.string(),
    sender: z.string(),
    type: z.enum(["text", "image"]),  // TODO: backport to kernel planckster
    trace: z.string(),  // TODO: backport to kernel planckster
});

export const UserMessageSchema = BaseMessageSchema.merge(z.object({
    senderType: z.literal("user"),
}));

export const AgentMessageSchema = BaseMessageSchema.merge(z.object({
    senderType: z.literal("agent"),
}));

export const MessageSchema = z.discriminatedUnion("senderType", [
    UserMessageSchema,
    AgentMessageSchema
]);
export type TMessage = z.infer<typeof MessageSchema>;

export const TextMessageSchema = BaseMessageSchema.extend({
    type: z.literal("text"),
});
export type TTextMessage = z.infer<typeof TextMessageSchema>;

export const ImageMessageSchema = BaseMessageSchema.extend({
    type: z.literal("image"),
});
export type TImageMessage = z.infer<typeof ImageMessageSchema>;