import { inject, injectable } from "inversify";
import { ILogObj, Logger } from "tslog";
import { CreateConversationDTO, ListConversationsDTO, SendMessageToConversationResponseDTO, ListMessagesForConversationDTO } from "~/lib/core/dto/conversation-gateway-dto";
import { TMessage } from "~/lib/core/entity/kernel-models";
import ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";

@injectable()
export default class BrowserConversationGateway implements ConversationGatewayOutputPort {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("ConversationGateway");
  }

  async createConversation(researchContextID: number, conversationTitle: string): Promise<CreateConversationDTO> {
    return {
      success: false,
      data: {
        operation: "browser#conversation#create",
        message: "Method deprecated",
      },
    };
  }

  async listConversations(researchContextID: number): Promise<ListConversationsDTO> {
    return {
      success: false,
      data: {
        operation: "browser#conversation#list-conversations",
        message: "Method deprecated",
      },
    };
  }

  async sendMessageToConversation(conversationID: number, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
    try {
      const dto = await this.api.gateways.conversation.sendMessageToConversation.mutate({
        conversationID,
        message,
      });
      this.logger.debug({ dto }, `Successfully retrieved response from server for sending message to conversation`);

      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to send message to conversation");

      return {
        success: false,
        data: {
          operation: "browser#conversation#send-message-to-conversation",
          message: "Could not invoke the server side feature to send message to conversation",
        },
      };
    }
  }

  async listMessagesForConversation(conversationID: number): Promise<ListMessagesForConversationDTO> {
    return {
      success: false,
      data: {
        operation: "browser#conversation#list-messages-for-conversation",
        message: "Method deprecated",
      },
    };
  }
}
