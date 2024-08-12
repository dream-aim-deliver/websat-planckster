import { inject, injectable } from "inversify";
import { z } from "zod";
import OpenAI from "openai";
import type { TCreateAgentDTO, TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import { GATEWAYS, KERNEL, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import { BaseErrorDTOSchema, DTOSchemaFactory } from "~/sdk/core/dto";
import { TMessage } from "~/lib/core/entity/kernel-models";
import { Logger } from "pino";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type { TKernelSDK } from "../config/kernel/kernel-sdk";
import { generateAgentName } from "../config/openai/openai-utils";

export const OpenAIMessageContext = DTOSchemaFactory(z.object({
    threadID: z.string(),
}), BaseErrorDTOSchema);

export type TOpenAIMessageContext = z.infer<typeof OpenAIMessageContext>;
@injectable()
export default class OpenAIAgentGateway implements AgentGatewayOutputPort<TOpenAIMessageContext> {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
        @inject(GATEWAYS.AUTH_GATEWAY) private AuthGateway: AuthGatewayOutputPort,
        @inject(KERNEL.KERNEL_SDK) private KernelSDK: TKernelSDK,
    ) {
        this.logger = loggerFactory("OpenAIAgentGateway");
    }
    async createAgent(researchContextID: number, researchContextName: string, researchContextDesciption: string, vectorStoreID: string): Promise<TCreateAgentDTO> {
        const kpCredentialsDTO = await this.AuthGateway.extractKPCredentials();
        if (!kpCredentialsDTO.success) {
            this.logger.error({ kpCredentialsDTO }, "Failed to extract KP credentials from session");
            return {
                success: false,
                data: {
                    message: "Failed to extract KP credentials from session",
                    operation: "openai:create-agent"
                }
            }
        }
        const clientID = kpCredentialsDTO.data.clientID;
        const agentName = generateAgentName(clientID, researchContextID);
        const instructions = `You are an expert data analyst specialized in ${researchContextName}. Your research context can be best described by ${researchContextDesciption}. You will help me and my team explore and analize some datasets that we have augmented, by combining data from satellites, twitter, and telegram, regarding the occurrence of disaster events related to ${researchContextName} at different locations. You have access to a code interpreter to generate insights from the data, and a file search tool to find relevant datasets.`;
        const model = "gpt-4o";
        try {
            const openaiAgent = await this.openai.beta.assistants.create({
                model: model,
                name: agentName,
                description: researchContextDesciption,
                instructions: instructions,
                tools: [
                    { "type": "code_interpreter" },
                    { "type": "file_search" }
                ],
                tool_resources: {
                    "file_search": {
                        "vector_store_ids": [vectorStoreID]
                    }
                }
            });
            const openaiAgentID = openaiAgent.id;
            this.logger.info({ openaiAgent }, "Agent created");
            return {
                success: true,
                data: {
                    id: openaiAgentID,
                    provider: "openai",
                    model: model,
                    researchContextID: researchContextID.toString(),
                    vectorStoreID: vectorStoreID,
                    tools: ["code_interpreter", "file_search"],
                    resources: {
                        vector_stores: [vectorStoreID]
                    },
                    instructions: instructions
                }
            }
        } catch (error) {
            this.logger.error({ error }, "Failed to create agent");
            return {
                success: false,
                data: {
                    message: "Failed to create agent",
                    operation: "openai:create-agent"
                }
            }
        }


    }
    async prepareMessageContext(researchContextID: string, conversationID: string, message: TMessage): Promise<{ data: { threadID: string; }; success: true; } | { data: { message: string; operation: string; }; success: false; }> {
        return {
            success: false,
            data: {
                message: "Method not implemented",
                operation: "openai:prepare-message-context"
            }
        }
    }
    async sendMessage(context: { threadID: string; } | { message: string; operation: string; }, message: TMessage): Promise<TSendMessageDTO> {
        return {
            success: false,
            data: {
                message: "Method not implemented",
                operation: "openai:send-message"
            }
        }
    }
}