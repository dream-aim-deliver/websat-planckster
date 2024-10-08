/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TMessage } from "../entity/kernel-models";
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
    const messageToSend: TMessage = {
      id: -1, // TODO: this should be assigned by KP at some point
      content: request.messageToSendContent,
      sender: "", // TODO: this should be obtained from the auth gateway at some point
      timestamp: request.messageToSendTimestamp,
      senderType: "user"
    };

    // TODO: finish secondary side, then come back here
    // TODO: check if conversation exists?
    // send incoming message to the conversation

    const registerIncomingMessageDTO = await this.conversationGateway.sendMessageToConversation(request.conversationID, messageToSend);

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

    // TODO: what happens if we arrive here, but then something fails and we never get a response? How can we tell the UI to show a 'retry' message, or put the message in a "failed" state? Maybe with the signal.value.operation?

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const prepareMessageDTO = await this.agentGateway.prepareMessageContext(request.researchContextID, request.conversationID, messageToSendRegistered);

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

    await this.presenter.presentProgress({
      status: "progress",
      message: messageToSendRegistered,
      progress: "Sending message to agent",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: prepareMessageDTO,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sendMessageToAgentDTO = await this.agentGateway.sendMessage(prepareMessageDTO.data, messageToSendRegistered);
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

    const registerOutgoingMessageDTO = await this.conversationGateway.sendMessageToConversation(request.conversationID, responseMessage);
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
