import { inject, injectable } from "inversify";
import { z } from "zod";
import OpenAI from "openai";
import type { TCreateAgentDTO, TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import env from "~/lib/infrastructure/server/config/env";
import { OPENAI, TRPC } from "../config/ioc/server-ioc-symbols";
import type { TServerComponentAPI } from "../trpc/server-api";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { TMessage } from "~/lib/core/entity/kernel-models";

export const OpenAIMessageContext = DTOSchemaFactory(z.object({
    threadID: z.string(),
}), BaseErrorDTOSchema);

export type TOpenAIMessageContext = z.infer<typeof OpenAIMessageContext>;
@injectable()
export default class OpenAIAgentGateway implements AgentGatewayOutputPort<TOpenAIMessageContext> {
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
    ) {
    }
    createAgent(researchContextID: number): Promise<TCreateAgentDTO> {
        throw new Error("Method not implemented.");
    }
    prepareMessageContext(researchContextID: string, conversationID: string, message: TMessage): Promise<{ data: { threadID: string; }; success: true; } | { data: { message: string; operation: string; }; success: false; }> {
        throw new Error("Method not implemented.");
    }
    sendMessage(context: { threadID: string; } | { message: string; operation: string; }, message: TMessage): Promise<TSendMessageDTO> {
        throw new Error("Method not implemented.");
    }


}