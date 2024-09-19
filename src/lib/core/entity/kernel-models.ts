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


export const MessageSchema = z.object({
    id: z.number(),
    content: z.string(),
    timestamp: z.string(),
    sender: z.string(),
});

export type TMessage = z.infer<typeof MessageSchema>;