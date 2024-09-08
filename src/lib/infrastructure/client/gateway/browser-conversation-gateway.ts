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

  async sendMessageToConversation(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
    throw new Error("Method not implemented.");
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
