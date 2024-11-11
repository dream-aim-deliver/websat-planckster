/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TMessageContent, type TMessage } from "../entity/kernel-models";
import { type SendMessageToConversationInputPort, type SendMessageToConversationOutputPort } from "../ports/primary/send-message-to-conversation-primary-ports";
import type AgentGatewayOutputPort from "../ports/secondary/agent-gateway-output-port";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";
import { type TSendMessageToConversationRequest } from "../usecase-models/send-message-to-conversation-usecase-models";

export default class BrowserSendMessageToConversationUseCase implements SendMessageToConversationInputPort {
  presenter: SendMessageToConversationOutputPort;
  agentGateway: AgentGatewayOutputPort<any>;
  conversationGateway: ConversationGatewayOutputPort;
  constructor(presenter: SendMessageToConversationOutputPort, agentGateway: AgentGatewayOutputPort<any>, conversationGateway: ConversationGatewayOutputPort) {
    this.presenter = presenter;
    this.agentGateway = agentGateway;
    this.conversationGateway = conversationGateway;
  }

  async execute(request: TSendMessageToConversationRequest): Promise<void> {
    const { researchContextExternalID, conversationID, messageToSendContent, messageToSendTimestamp, messageToSendAdditionalContext } = request;

    // 1. Prepare message context to send to agent
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const prepareMessageDTO = await this.agentGateway.prepareMessageContext(researchContextExternalID, conversationID);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!prepareMessageDTO.success) {
      await this.presenter.presentError({
        status: "error",
        operation: "usecase#send-message-to-conversation",
        message: "Could not prepare message context to send to agent",
        context: {},
      });
      return;
    }

    // 2. Register incoming message
    const contentToSend: TMessageContent = {
      content: messageToSendContent,
      content_type: "text",
    };

    const messageToSend: TMessage = {
      message_contents: [contentToSend],
      sender: "", // TODO: this should be obtained from the auth gateway at some point, once kernel is refactored and the UI kit handles the 'sender' field
      sender_type: "user",
      created_at: messageToSendTimestamp,
    };

    const registerIncomingMessageDTO = await this.conversationGateway.sendMessageToConversation(conversationID, messageToSend);

    if (!registerIncomingMessageDTO.success) {
      await this.presenter.presentError({
        status: "error",
        operation: "usecase#send-message-to-conversation",
        message: "Could not register incoming message",
        context: {},
      });
      return;
    }

    const messageToSendRegistered = registerIncomingMessageDTO.data.message;

    // TODO: handle the case in which the message by the user is registered in kernel, but then something fails and we never get a response. E.g., show a 'retry' message in the UI, or put the message in a "failed" state (maybe with the signal.value.operation)

    await this.presenter.presentProgress({
      status: "progress",
      message: messageToSendRegistered,
      progress: "Sending message to agent",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: prepareMessageDTO,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sendMessageToAgentDTO = await this.agentGateway.sendMessage(prepareMessageDTO.data, messageToSendRegistered, messageToSendAdditionalContext);
    if (!sendMessageToAgentDTO.success) {
      await this.presenter.presentError({
        status: "error",
        operation: "usecase#send-message-to-conversation",
        message: "Could not send registered incoming message to agent",
        context: {},
      });
      return;
    }

    await this.presenter.presentProgress({
      status: "progress",
      message: messageToSendRegistered,
      progress: "Agent replied to the message",
      context: sendMessageToAgentDTO,
    });

    const responseMessage = sendMessageToAgentDTO.data;

    const registerOutgoingMessageDTO = await this.conversationGateway.sendMessageToConversation(conversationID, responseMessage);
    if (!registerOutgoingMessageDTO.success) {
      await this.presenter.presentError({
        status: "error",
        operation: "usecase#send-message-to-conversation",
        message: "Could not register outgoing message",
        context: {},
      });
      return;
    }

    await this.presenter.presentSuccess({
      status: "success",
      message: messageToSendRegistered,
      response: responseMessage,
    });
  }
}
