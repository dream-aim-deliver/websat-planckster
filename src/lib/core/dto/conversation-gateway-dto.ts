import { z } from "zod";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "@/sdk/core/dto";
import { ConversationSchema, MessageSchema } from "../entity/kernel-models";


export const SendMessageToConversationResponseDTODataSchema = z.discriminatedUnion(
    "type", [
    z.object({
        type: z.enum(["success"]),
        conversationID: z.number(),
        message: MessageSchema,
    }),
    z.object({
        type: z.enum(["progress"]),
        conversationID: z.number(),
        message: MessageSchema,
        progressMessage: z.string(),
    }),
])
export const SendMessageToConversationResponseDTO = DTOSchemaFactory(
    SendMessageToConversationResponseDTODataSchema,
    BaseErrorDTOSchema,
)

export type SendMessageToConversationResponseDTO = z.infer<typeof SendMessageToConversationResponseDTO>;


export const ListMessagesForConversationDTOSchema = DTOSchemaFactory(
    z.array(MessageSchema),
    BaseErrorDTOSchema,
)

export type ListMessagesForConversationDTO = z.infer<typeof ListMessagesForConversationDTOSchema>;

export const CreateConversationDTOSchema = DTOSchemaFactory(
    ConversationSchema,
    BaseErrorDTOSchema,
)

export type CreateConversationDTO = z.infer<typeof CreateConversationDTOSchema>;

export const ListConversationsDTOSchema = DTOSchemaFactory(
    z.array(ConversationSchema),
    BaseErrorDTOSchema,
)
export type ListConversationsDTO = z.infer<typeof ListConversationsDTOSchema>;
