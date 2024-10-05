import { inject, injectable } from "inversify";
import { type CreateConversationDTO, type ListConversationsDTO, type SendMessageToConversationResponseDTO, type ListMessagesForConversationDTO } from "~/lib/core/dto/conversation-gateway-dto";
import { type TMessage } from "~/lib/core/entity/kernel-models";
import type ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import { GATEWAYS, KERNEL, UTILS } from "../config/ioc/server-ioc-symbols";
import { Logger } from "pino";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { type TKernelSDK } from "../config/kernel/kernel-sdk";
import { TBaseErrorDTOData } from "~/sdk/core/dto";
import { ListMessagesViewModel_Input, MessageBase as KernelPlancksterMessageBase, NewMessageViewModel } from "@maany_shr/kernel-planckster-sdk-ts";


@injectable()
export default class KernelConversationGateway implements ConversationGatewayOutputPort {
  private logger: Logger;
  constructor(
    @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
    @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
  ) {
    this.logger = this.loggerFactory("ConversationGateway");
  }

  async createConversation(researchContextID: number, conversationTitle: string): Promise<CreateConversationDTO> {
    try {
      const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        this.logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "kernel#conversation#create",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData,
        };
      }

      const newConversationViewModel = await this.kernelSDK.createConversation({
        id: researchContextID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
        conversationTitle: conversationTitle,
      });

      if (newConversationViewModel.status) {
        this.logger.debug({newConversationViewModel}, `Successfully created conversation '${conversationTitle}' for Research Context with ID ${researchContextID}`);

        return {
          success: true,
          data: {
            id: newConversationViewModel.conversation_id,
            title: conversationTitle,
          },
        };
      }

      this.logger.error({newConversationViewModel}, `Failed to create conversation for Research Context with ID ${researchContextID}`);

      return {
        success: false,
        data: {
          message: `Failed to create conversation for Research Context with ID ${researchContextID}`,
          operation: "kernel#conversation#create",
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error({err}, `An error occurred while creating a conversation: ${err.message}`);
      return {
        success: false,
        data: {
          message: err.message,
          operation: "kernel#conversation#create",
        },
      };
    }
  }

  async listConversations(researchContextID: number): Promise<ListConversationsDTO> {
    try {
      const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        this.logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "kernel#conversation#list",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData,
        };
      }

      const listConversationsViewModel = await this.kernelSDK.listConversations({
        id: researchContextID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });

      if (listConversationsViewModel.status) {
        this.logger.debug({listConversationsViewModel},`Successfully listed conversations for Research Context with ID ${researchContextID}.`);

        return {
          success: true,
          data: listConversationsViewModel.conversations,
        };
      }

      this.logger.error({listConversationsViewModel}, `Failed to list conversations for Research Context with ID ${researchContextID}`);

      return {
        success: false,
        data: {
          operation: "kernel#conversation#list",
          message: `Failed to list messages for Research Context with ID ${researchContextID}`,
        } as TBaseErrorDTOData,
      };

    } catch (error) {
      const err = error as Error;
      this.logger.error({err}, `An error occurred while listing conversations: ${err.message}`);
      return {
        success: false,
        data: {
          message: err.message,
          operation: "kernel#conversation#list",
        },
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMessageToConversation(conversationID: number, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
    try {
      const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        this.logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "kernel#conversation#send-message",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData,
        };
      }

      // TODO: refasctor this once the kernel SDK is updated
      const createMessageViewModel: NewMessageViewModel = await this.kernelSDK.createMessage({
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
        id: conversationID,
        messageContent: message.content,
        unixTimestamp: message.timestamp,
        senderType: message.sender
      })

      if (!createMessageViewModel.status) {
        this.logger.error({createMessageViewModel}, `Failed to send message to conversation with ID ${conversationID}`);
        return {
          success: false,
          data: {
            operation: "kernel#conversation#send-message",
            message: `Failed to send message to conversation with ID ${conversationID}`,
          } as TBaseErrorDTOData,
        };
      }
       
      this.logger.debug({createMessageViewModel}, `Successfully sent message to conversation with ID ${conversationID}`);

      return {
        success: true,
        data: {
          message: {
            id: createMessageViewModel.message_id,
            content: message.content,
            timestamp: message.timestamp,
            sender: message.sender,
            senderType: message.senderType,
          },
          type: "success",
          conversationID: conversationID,
          response: {  // TODO: this shouldn't be needed here, so is doing this OK?
            id: -1,
            content: "",
            timestamp: message.timestamp,
            sender: message.sender,
            senderType: message.senderType,
          }
        },
      };

    } catch (error) {
      const err = error as Error;
      this.logger.error({err}, `An error occurred while sending message to conversation: ${err.message}`);
      return {
        success: false,
        data: {
          message: err.message,
          operation: "kernel#conversation#send-message",
        },
      };
    }
  }

  async listMessagesForConversation(conversationID: number): Promise<ListMessagesForConversationDTO> {
    try {
      const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        this.logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "kernel#conversation#get-messages",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData,
        };
      }

      const listMessagesViewModel: ListMessagesViewModel_Input = await this.kernelSDK.listMessages({
        id: conversationID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });

      if (listMessagesViewModel.status) {
        this.logger.debug({listMessagesViewModel}, `Successfully listed messages for conversation with ID ${conversationID}`);

        const kpMessages: KernelPlancksterMessageBase[] = listMessagesViewModel.message_list;

        const messages: TMessage[] = kpMessages.map((kpMessage) => {
          return {
            id: kpMessage.id,
            content: kpMessage.content,  // TODO: coordinate this once the new KP client is ready, how to handle content?
            timestamp: parseInt(kpMessage.timestamp),  // TODO: coordinate this, should it be a string or a number?
            sender: kpMessage.sender,
            senderType: kpMessage.sender_type,
          };
        });

        return {
          success: true,
          data: messages,
        };
      }

      this.logger.error({listMessagesViewModel}, `Failed to list messages for conversation with ID ${conversationID}`);

      return {
        success: false,
        data: {
          operation: "kernel#conversation#get-messages",
          message: `Failed to list messages for conversation with ID ${conversationID}`,
        } as TBaseErrorDTOData,
      };

    } catch (error) {
      const err = error as Error;
      this.logger.error({err}, `An error occurred while listing messages for conversation: ${err.message}`);
      return {
        success: false,
        data: {
          message: err.message,
          operation: "kernel#conversation#get-messages",
        },
      };
    }
  }
}
