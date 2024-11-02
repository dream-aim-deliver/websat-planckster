import { z } from "zod";

export const ActiveResearchContextSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(["active"]),
    //message: z.string().optional(),
    description: z.string(),
    //context: z.string().optional(),
  });
  
export const ProgressingOrErrorResearchContextSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(["progressing", "error"]),
    message: z.string(),
    description: z.string(),
    context: z.string().optional(),
});
  
export const ResearchContextSchema = z.discriminatedUnion(
    "status",
    [ActiveResearchContextSchema, ProgressingOrErrorResearchContextSchema]
);
export type TResearchContext = z.infer<typeof ResearchContextSchema>;

export const ConversationSchema = z.object({
    id: z.number(),
    title: z.string(),
    created_at: z.string().optional(),
});
export type TConversation = z.infer<typeof ConversationSchema>;


export const BaseMessageSchema = z.object({
    id: z.number(),
    content: z.string(),
    timestamp: z.string(),
    sender: z.string(),
});

export const UserMessageSchema = z.object({
    senderType: z.literal("user"),
});

export const AgentMessageSchema = z.object({
    senderType: z.literal("agent"),
});

export const MessageSchema = z.discriminatedUnion("senderType", [
    UserMessageSchema,
    AgentMessageSchema
]);
export type TMessage = z.infer<typeof MessageSchema>;