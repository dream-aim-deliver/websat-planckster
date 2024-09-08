import { type ListMessagesForConversationInputPort, type ListMessagesForConversationOutputPort } from "../ports/primary/list-messages-for-conversation-primary-ports";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";
import { type TListMessagesForConversationRequest, type TListMessagesForConversationResponse } from "../usecase-models/list-messages-for-conversation-usecase-models";

export default class ListMessagesForConversationUsecase implements ListMessagesForConversationInputPort {
  presenter: ListMessagesForConversationOutputPort;
  conversationGateway: ConversationGatewayOutputPort;

  constructor(presenter: ListMessagesForConversationOutputPort, conversationGateway: ConversationGatewayOutputPort) {
    this.presenter = presenter;
    this.conversationGateway = conversationGateway;
  }

  async execute(request: TListMessagesForConversationRequest): Promise<void> {
    try {
      const { conversationID } = request;

      const dto = await this.conversationGateway.listMessagesForConversation(conversationID);

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          message: dto.data.message,
          context: {
            conversationID: conversationID,
          },
          operation: "usecase#kp-listMessagesForConversation"
        })
        return;
      }

      const successResponse: TListMessagesForConversationResponse = {
        status: "success",
        messages: dto.data,
      };

      await this.presenter.presentSuccess(successResponse);

    } catch (error) {
      const err = error as Error;

      await this.presenter.presentError({
        status: "error",
        message: err.message ?? "An error occurred while listing messages for conversation",
        operation: "usecase#list-messages-for-conversation",
        context: {
          conversationID: request.conversationID,
          error: error,
        },
      });
    }
  }
}