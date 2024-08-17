import { type ListConversationsInputPort } from "../ports/primary/list-conversations-primary-ports";
import { type TListConversationsRequest, type TListConversationsResponse } from "../usecase-models/list-conversations-usecase-models";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";

export default class ListConversationsUsecase implements ListConversationsInputPort {
  conversationGateway: ConversationGatewayOutputPort;

  constructor(conversationGateway: ConversationGatewayOutputPort) {
    this.conversationGateway = conversationGateway;
  }

  async execute(request: TListConversationsRequest): Promise<TListConversationsResponse> {
    try {
      const { researchContextID } = request;

      const dto = await this.conversationGateway.listConversations(researchContextID);

      if (dto.success) {
        return {
          status: "success",
          conversations: dto.data,
        };
      } else {
        return {
          status: "error",
          message: dto.data.message,
          operation: "usecase#list-conversations",
          context: {
            researchContextId: researchContextID,
          },
        };
      }
    } catch (error) {
      const err = error as Error;
      return {
        status: "error",
        message: err.message,
        operation: "usecase#list-conversations",
        context: {
          researchContextId: request.researchContextID,
        },
      };
    }
  }
}
