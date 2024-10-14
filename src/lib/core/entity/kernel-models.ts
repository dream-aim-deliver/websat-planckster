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
    created_at: z.string().optional(),
});
export type TConversation = z.infer<typeof ConversationSchema>;

export const BaseMessageContentSchema = z.object({
    content: z.string(),
    content_type: z.enum(["text", "image", "citation"]),
});
export type TBaseMessageContent = z.infer<typeof BaseMessageContentSchema>;

export const MessageContentSchema = z.object({
    id: z.number(),
    BaseMessageContentSchema,
});
export type TMessageContent = z.infer<typeof MessageContentSchema>;

export const MessageSchema = z.object({
    id: z.number(),
    message_contents: z.array(BaseMessageContentSchema),
    sender: z.string(),
    senderType: z.union([z.literal("user"), z.literal("agent")]),
});

export type TMessage = z.infer<typeof MessageSchema>;