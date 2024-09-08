import type { CreateConversationInputPort, CreateConversationOutputPort } from "../ports/primary/create-conversation-primary-ports";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";
import type { TCreateConversationRequest, TCreateConversationResponse } from "../usecase-models/create-conversation-usecase-models";

export default class CreateConversationUsecase implements CreateConversationInputPort {
  presenter: CreateConversationOutputPort;
  conversationGateway: ConversationGatewayOutputPort;

  constructor(presenter: CreateConversationOutputPort, conversationGateway: ConversationGatewayOutputPort) {
    this.presenter = presenter;
    this.conversationGateway = conversationGateway;
  }

  async execute(request: TCreateConversationRequest): Promise<void> {
    try {
      const { researchContextID, conversationTitle } = request;

      const dto = await this.conversationGateway.createConversation(researchContextID, conversationTitle);

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          message: dto.data.message,
          operation: "usecase#create-conversation",
          context: {
            researchContextId: researchContextID,
            title: conversationTitle,
          },
        })
        return;
      }

      const successResponse: TCreateConversationResponse = {
        status: "success",
        conversation: dto.data,
      };
      await this.presenter.presentSuccess(successResponse);

    } catch (error) {
      const err = error as Error;
      await this.presenter.presentError({
        status: "error",
        message: err.message ?? "An error occurred while creating conversation",
        operation: "usecase#create-conversation",
        context: {
          researchContextId: request.researchContextID,
          title: request.conversationTitle,
        },
      });
    }
  }
}
