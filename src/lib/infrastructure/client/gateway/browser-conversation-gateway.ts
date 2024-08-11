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

    const response = await this.api.kernel.conversation.create.mutate({
      researchContextID: parseInt(researchContextID),
      conversationTitle: conversationTitle
    });

    return response;
  }

  async listConversations(researchContextID: string): Promise<ListConversationsDTO> {
    const response = await this.api.kernel.conversation.list.query({
      researchContextID: parseInt(researchContextID)
    });

    return response;
  }

  async sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
    throw new Error('Method not implemented.');
  }

  async getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO> {
    const response = await this.api.kernel.message.list.query({
      conversationID: parseInt(conversationID)
    });

    return response;
  }

}