import { type CreateConversationInputPort, CreateConversationOutputPort } from "../ports/primary/create-conversation-primary-ports";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";
import { type TCreateConversationRequest, type TCreateConversationResponse } from "../usecase-models/create-conversation-usecase-models";

export default class CreateConversationUsecase implements CreateConversationInputPort {
  conversationGateway: ConversationGatewayOutputPort;

  constructor(conversationGateway: ConversationGatewayOutputPort) {
    this.conversationGateway = conversationGateway;
  }

  async execute(request: TCreateConversationRequest): Promise<TCreateConversationResponse> {
    const { researchContextID, conversationTitle } = request;

    const dto = await this.conversationGateway.createConversation(researchContextID, conversationTitle);

    if (dto.success) {
      return {
        status: "success",
        conversation: dto.data,
      };
    } else {
      return {
        status: "error",
        message: dto.data.message,
        operation: "usecase#create-conversation",
        context: {
          researchContextId: researchContextID,
          title: conversationTitle,
        },
      };
    }
  }
}
