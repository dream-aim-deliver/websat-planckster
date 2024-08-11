import { inject, injectable } from "inversify";
import { type CreateConversationDTO, type ListConversationsDTO, type SendMessageToConversationResponseDTO, type ListMessagesForConversationDTO } from "~/lib/core/dto/conversation-gateway-dto";
import { type TMessage } from "~/lib/core/entity/kernel-models";
import type ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import { GATEWAYS, KERNEL, UTILS } from "../../server/config/ioc/server-ioc-symbols";
import { Logger } from "pino";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { type TKernelSDK } from "../config/kernel/kernel-sdk";
import { TBaseErrorDTOData } from "~/sdk/core/dto";

@injectable()
export default class ConversationGateway implements ConversationGatewayOutputPort {

    private logger: Logger
    constructor(
    @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
    @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger
    ) {
    this.logger = this.loggerFactory("ConversationGateway")
    }

    async createConversation(researchContextID: string, conversationTitle: string): Promise<CreateConversationDTO> {
        try {

            const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                this.logger.error(
                    `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`
                );
                return {
                    success: false,
                    data: {
                        operation: "create-conversation",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData
                };
            }

            const researchContextIDNumber = parseInt(researchContextID);

            const newConversationViewModel = await this.kernelSDK.createConversation({
                id: researchContextIDNumber,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
                conversationTitle: conversationTitle,
            });

            if(newConversationViewModel.status) {
                this.logger.debug(`Successfully created conversation '${conversationTitle}' for Research Context with ID ${researchContextID}. View model code: ${newConversationViewModel.code}`);
                
                return {
                    success: true,
                    data: {
                        id: newConversationViewModel.conversation_id,
                        title: conversationTitle,
                    }
                };
            }

            this.logger.error(`Failed to create conversation for Research Context with ID ${researchContextID}: ${newConversationViewModel.errorMessage}`);

            return {
                success: false,
                data: {
                    message: `Failed to create conversation for Research Context with ID ${researchContextID}`,
                    operation: "create-conversation",
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

            const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                this.logger.error(
                    `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`
                );
                return {
                    success: false,
                    data: {
                        operation: "list-conversations",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData
                };
            }

            const researchContextIDNumber = parseInt(researchContextID);

            const listConversationsViewModel = await this.kernelSDK.listConversations({
                id: researchContextIDNumber,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
            });

            if(listConversationsViewModel.status) {

                this.logger.debug(`Successfully listed conversations for Research Context with ID ${researchContextID}. View model code: ${listConversationsViewModel.code}`);

                return {
                    success: true,
                    data: listConversationsViewModel.conversations
                };
            }

            this.logger.error(
                `Failed to list conversations for Research Context with ID ${researchContextID}: ${listConversationsViewModel.errorMessage}`
            );
            return {
                success: false,
                data: {
                    operation: "list-conversations",
                    message: `Failed to list messages for Research Context with ID ${researchContextID}`,
                } as TBaseErrorDTOData
            };

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

    async getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO> {

        try {

            const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                this.logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
                return {
                    success: false,
                    data: {
                        operation: "get-conversation-messages",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData
                };
            }

            const conversationIDNumber = parseInt(conversationID);

            const listMessagesViewModel = await this.kernelSDK.listMessages({
                id: conversationIDNumber,
                xAuthToken: kpCredentialsDTO.data.xAuthToken, 
            });

            if(listMessagesViewModel.status) {

                this.logger.debug(`Successfully listed messages for conversation with ID ${conversationID}. View model code: ${listMessagesViewModel.code}`);

                const kpMessages = listMessagesViewModel.message_list

                const messages: TMessage[] = kpMessages.map((kpMessage) => {
                    return {
                        id: kpMessage.id,
                        content: kpMessage.content,
                        timestamp: kpMessage.timestamp,
                        sender: kpMessage.sender,
                        senderType: kpMessage.sender_type,
                    }
                });

                return {
                    success: true,
                    data: messages
                };
            }

            this.logger.error(`Failed to list messages for conversation with ID ${conversationID}: ${listMessagesViewModel.errorMessage}`);

            return {
                success: false,
                data: {
                    operation: "get-conversation-messages",
                    message: `Failed to list messages for conversation with ID ${conversationID}`,
                } as TBaseErrorDTOData
            };


        } catch (error) {
            const err = error as Error;
            this.logger.error(`An error occurred while listing messages for conversation: ${err.message}`);
            return {
                success: false,
                data: {
                    message: err.message,
                    operation: "get-conversation-messages",
                }
            }
        }



    }
}