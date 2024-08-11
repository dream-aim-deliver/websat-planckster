import { inject, injectable } from "inversify";
import { type CreateConversationDTO, type ListConversationsDTO, type SendMessageToConversationResponseDTO, type ListMessagesForConversationDTO } from "~/lib/core/dto/conversation-gateway-dto";
import { type TMessage } from "~/lib/core/entity/kernel-models";
import type ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import { type ILogObj, Logger } from "tslog";

@injectable()
export default class BrowserConversationGateway implements ConversationGatewayOutputPort {

    private logger: Logger<ILogObj>
    constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>
    ) {
    this.logger = this.loggerFactory("BrowserConversationGateway")
    }
 

    async createConversation(researchContextID: string, conversationTitle: string): Promise<CreateConversationDTO> {
        try {

            const researchContextIDNumber = parseInt(researchContextID);

            const routerDTO = await this.api.kernel.conversation.create.mutate({
                researchContextID: researchContextIDNumber, 
                conversationTitle: conversationTitle,
            });

            if (!routerDTO.success) {
                this.logger.error(`Failed to create a conversation: ${routerDTO.data.message}`);
                return {
                    success: false,
                    data: {
                        message: routerDTO.data.message,
                        operation: routerDTO.data.operation,
                    }
                }
            }

            this.logger.debug(`Successfully created a conversation with ID ${routerDTO.data.conversation_id}`);
            return {
                success: true,
                data: {
                    id: routerDTO.data.conversation_id,
                    title: conversationTitle,
                }
            }

        } catch (error) {
            const err = error as Error;
            this.logger.error(`An error occurred while creating a conversation: ${err.message}`);
            return {
                success: false,
                data: {
                    message: err.message,
                    operation: "create-conversation",

                }
            }
        }


    }

    async listConversations(researchContextID: string): Promise<ListConversationsDTO> {

        try {

            const researchContextIDNumber = parseInt(researchContextID);

            const routerDTO = await this.api.kernel.conversation.list.query({
                researchContextID: researchContextIDNumber,
            });

            if (!routerDTO.success) {
                this.logger.error(`Failed to list conversations: ${routerDTO.data.message}`);
                return {
                    success: false,
                    data: {
                        message: routerDTO.data.message,
                        operation: routerDTO.data.operation,
                    }
                }
            }

            this.logger.debug(`Successfully listed conversations for Research Context with ID ${routerDTO.data.research_context_id}`);
            
            const conversations = routerDTO.data.conversations

            return {
                success: true,
                data: conversations
            }


        } catch (error) {
            const err = error as Error;
            this.logger.error(`An error occurred while listing conversations: ${err.message}`);
            return {
                success: false,
                data: {
                    message: err.message,
                    operation: "list-conversations",
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO> {
        throw new Error("Method not implemented.");
    }
}