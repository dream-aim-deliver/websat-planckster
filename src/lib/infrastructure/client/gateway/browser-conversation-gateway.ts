import { inject, injectable } from 'inversify';
import { ILogObj, Logger } from 'tslog';
import { CreateConversationDTO, ListConversationsDTO, SendMessageToConversationResponseDTO, ListMessagesForConversationDTO } from '~/lib/core/dto/conversation-gateway-dto';
import { TMessage } from '~/lib/core/entity/kernel-models';
import ConversationGatewayOutputPort from '~/lib/core/ports/secondary/conversation-gateway-output-port';
import { TRPC, UTILS } from '../config/ioc/client-ioc-symbols';
import { type TVanillaAPI } from '../trpc/vanilla-api';


@injectable()
export default class BrowserConversationGateway implements ConversationGatewayOutputPort  {

  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>
    ) {
    this.logger = this.loggerFactory("ConversationGateway")
    }

  async createConversation(researchContextID: string, conversationTitle: string): Promise<CreateConversationDTO> {
    try {
      const researchContextIDNumber = parseInt(researchContextID);

      const response = await this.api.kernel.conversation.create.mutate({
        researchContextID: researchContextIDNumber,
        conversationTitle: conversationTitle
      });

      return response;

    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error creating conversation: ${err.message}`);
      return {
        success: false,
        data: {
          operation: "browser#conversation#create",
          message: err.message
        }
      }
    }
  }

  async listConversations(researchContextID: string): Promise<ListConversationsDTO> {
    try {
      const researchContextIDNumber = parseInt(researchContextID);
      const response = await this.api.kernel.conversation.list.query({
        researchContextID: researchContextIDNumber
      });

      return response;

    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error listing conversations: ${err.message}`);
      return {
        success: false,
        data: {
          operation: "browser#conversation#list",
          message: err.message
        }
      }
    }

  }

  async sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
    throw new Error('Method not implemented.');
  }

  async getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO> {
    try {
      const conversationIDNumber = parseInt(conversationID);
      const response = await this.api.kernel.message.list.query({
        conversationID: conversationIDNumber
      });

      return response;

    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error getting conversation messages: ${err.message}`);
      return {
        success: false,
        data: {
          operation: "browser#conversation#get-conversation-messages",
          message: err.message
        }
      }
    }
  }

}