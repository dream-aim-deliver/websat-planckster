import type { z } from "zod";
import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { AgentSchema } from "../entity/dadbod/agent";
import { MessageSchema } from "../entity/kernel-models";


/**
 * Creates a DTOSchema for creating an agent.
 * 
 * @param {AgentSchema} agentSchema - The schema for the agent.
 * @param {BaseErrorDTOSchema} baseErrorDTOSchema - The schema for the base error DTO.
 * @returns {DTOSchema} - The created DTOSchema.
 */
export const CreateAgentDTOSchema = DTOSchemaFactory(
    AgentSchema,
    BaseErrorDTOSchema,
);

export type TCreateAgentDTO = z.infer<typeof CreateAgentDTOSchema>;

export const SendMessageDTO = DTOSchemaFactory(
    MessageSchema,
    BaseErrorDTOSchema,
);

export type TSendMessageDTO = z.infer<typeof SendMessageDTO>;

