import type { ListConversationsOutputPort, ListConversationsInputPort } from "../ports/primary/list-conversations-primary-ports";
import type { TListConversationsRequest, TListConversationsResponse } from "../usecase-models/list-conversations-usecase-models";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";

export default class ListConversationsUsecase implements ListConversationsInputPort {
  presenter: ListConversationsOutputPort;
  conversationGateway: ConversationGatewayOutputPort;

  constructor(presenter: ListConversationsOutputPort, conversationGateway: ConversationGatewayOutputPort) {
    this.presenter = presenter;
    this.conversationGateway = conversationGateway;
  }

  async execute(request: TListConversationsRequest): Promise<void> {
    try {
      const { researchContextID } = request;

      const dto = await this.conversationGateway.listConversations(researchContextID);

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          message: dto.data.message,
          context: {
            researchContextId: researchContextID,
          },
          operation: "usecase#kp-listConversations"
        })
        return;
      }

      const successResponse: TListConversationsResponse = {
        status: "success",
        conversations: dto.data,
      };

      await this.presenter.presentSuccess(successResponse);


    } catch (error) {
      const err = error as Error;

      await this.presenter.presentError({
        status: "error",
        message: err.message ?? "An error occurred while listing conversations",
        operation: "usecase#list-conversations",
        context: {
          researchContextId: request.researchContextID,
          error: error,
        },
      });
    }
  }
}
