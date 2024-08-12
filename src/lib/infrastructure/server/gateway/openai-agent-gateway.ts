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
import { MessageContent, MessageCreateParams } from "openai/resources/beta/threads/messages.mjs";
import { Run, RunStatus } from "openai/resources/beta/threads/runs/runs.mjs";
import { uint8ArrayToBase64 } from "~/lib/core/utils/message";

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
    async prepareMessageContext(researchContextID: string, conversationID: string, message: TMessage): Promise<{ data: { threadID: string; assistantID: string }; success: true; } | { data: { message: string; operation: string; }; success: false; }> {
        return {
            success: false,
            data: {
                message: "Method not implemented",
                operation: "openai:prepare-message-context"
            }
        }
    }
    async sendMessage(context: { threadID: string; assistantID: string } | { message: string; operation: string; }, messageToSend: TMessage): Promise<TSendMessageDTO> {

        try {

            if (!context || !("threadID" in context) || !("assistantID" in context)) {
                this.logger.error(`Failed to send message to OpenAI: invalid context`);
                return {
                    success: false,
                    data: {
                        message: "Invalid context",
                        operation: "openai#send-message"
                    }
                }
            }

            const { threadID, assistantID } = context;

            this.logger.debug(`Sending message to OpenAI thread ${threadID}`);

            // 1. Send the new message to OpenAI
            const openAIMessageToSend: MessageCreateParams = {
                role: messageToSend.senderType === "user" ? "user" : "assistant",
                content: messageToSend.content,
            }

            const openAIMessageToSendReceivedBack = await this.openai.beta.threads.messages.create(
                threadID,
                openAIMessageToSend
            )

            // NOTE: double check if this is a robust way to check if the message was sent
            if (!openAIMessageToSendReceivedBack) {
                this.logger.error(`Failed to send message to OpenAI thread ${threadID}`);
                return {
                    success: false,
                    data: {
                        message: "Failed to send message to OpenAI",
                        operation: "openai#send-message"
                    }
                }
            }

            this.logger.debug(`Message sent to OpenAI thread ${threadID}, now creating a Run`);

            // 2. Post a new run
            const run: Run = await this.openai.beta.threads.runs.create(
                threadID,
                {
                    assistant_id: assistantID,
                }
            )

            // 3. Wait until the run is completed or failed

            let runStatus: RunStatus = run.status;

            while (runStatus === "queued" || runStatus === "in_progress") {

                // wait 1 second between every run check
                await new Promise((resolve) => setTimeout(resolve, 1000));

                this.logger.debug(`Run ${run.id} is in status '${runStatus}'`);

                runStatus = (await this.openai.beta.threads.runs.retrieve(threadID, run.id)).status;

                if (runStatus === 'cancelling' || runStatus == 'expired' || runStatus == 'failed' || runStatus == 'cancelled') {
                    this.logger.error(`Run ${run.id} failed with status '${runStatus}'`);
                    return {
                        success: false,
                        data: {
                            message: `Run ${run.id} failed with status '${runStatus}'`,
                            operation: "openai#send-message"
                        }
                    }

                }

                if (runStatus === 'completed'){
                    this.logger.debug(`Run ${run.id} completed`);

                    let page = await this.openai.beta.threads.messages.list(threadID); 

                    let items  = page.getPaginatedItems();

                    while(page.hasNextPage()) {
                        page = await page.getNextPage();
                        items = items.concat(page.getPaginatedItems());
                    }

                    // TIP: For handling images, see https://community.openai.com/t/how-do-download-files-generated-in-ai-assistants/493516/3

                    const sortedItems = items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

                    const lastItem = sortedItems.slice(-1)[0]; 
                    
                    if (!lastItem) {
                        this.logger.error(`No messages found in thread ${threadID}`);
                        return {
                            success: false,
                            data: {
                                message: `No messages found in thread ${threadID}`,
                                operation: "openai#send-message"
                            }
                        }
                    }

                    const lastContent: MessageContent[] = lastItem.content
                    

                    // TODO: send back each of these in the DTO, so the DTO needs refactoring
                    // TODO: ultimately, we'll refactor kernel to allow for message type and message trace, so all of these also need a message trace
                    for (const content of lastContent) {

                        switch (content.type) {
                            case 'text':
                                this.logger.debug(`Text message: ${content.text.value}`);
                                lastMessage = {
                                   content: content.text.value,
                                   type: 'text', 
                                };

                            case 'image_file':
                                this.logger.debug(`Image message`);

                                const fileId = content.
                                const file = await this.openai.files.content(fileId);
                                const bufferView = new Uint8Array(await file.arrayBuffer());
                                const base64 = uint8ArrayToBase64(bufferView);

                                lastMessage = {
                                    content: content.,
                                    type: 'image',
                                }


                            default:
                                this.logger.debug(`Unknown message type: ${content.type}`);
                        }


                        for ( const message of content) {

                            if (message.type === 'image_file') {
                                this.logger.debug(`image message`)

                                const fileId = message.image_file.file_id;
                                const file = await this.openai.files.content(fileId);
                                const bufferView = new Uint8Array(await file.arrayBuffer());
                                const base64 = uint8ArrayToBase64(bufferView);
                                messages.push({
                                    "content": base64,
                                    "role": item.role === 'user' ? 'user' : 'agent',
                                    "type": 'image',
                                    "timestamp": item.created_at
                                })
                            } else if (message.type === 'text') {
                                this.logger.debug("text message")
                                messages.push({
                                    "content": message.text.value,
                                    "role": item.role === 'user' ? 'user' : 'agent',
                                    "type": 'text',
                                    "timestamp": item.created_at
                                })
                            }
                        }}
                    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                    const lastMessage = messages.slice(-1);
                    const lastMessageContent = lastMessage[0]!.content;
                    console.log(`Last message: ${lastMessageContent}`);

                    const dto: openAIDTO = {
                        status: true,
                        code: 200,
                        responseMessage: lastMessageContent,
                    }

                    return dto

                }




                }
            


            
           }


        } catch (error) {
            const err = error as Error;
            this.logger.error(`An error occurred while sending a message to OpenAI: ${err.message}`);
            return {
                success: false,
                data: {
                    message: err.message,
                    operation: "openai#send-message"
                }
            }
        }




    }
}