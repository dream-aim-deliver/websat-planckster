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
        id: -1,  // this should be assigned by KP at some point
        content: request.messageToSendContent,
        sender: "User",  // this should be obtained from the auth gateway at some point
        timestamp: request.messageToSendTimestamp,
    }

    const dummyResponse: TMessage = {
      id: -1,
      content: "Dummy response",
      sender: "Dummy",
      timestamp: new Date().toDateString(),
    };

    await this.presenter.presentSuccess({
      status: "success",
      message: messageToSend,
      response: dummyResponse,
    });

    // TODO: finish secondary side, then come back here
    //// TODO: check if conversation exists
    //// send incoming message to the conversation
    //const registerIncomingMessageDTO = await this.conversationGateway.sendMessageToConversation(request.conversationID, request.message);

    //if (!registerIncomingMessageDTO.success) {
    //this.presenter.presentError({
    //status: "error",
    //operation: "usecase#send-message-to-conversation",
    //message: "",
    //context: {},
    //});
    //return;
    //}

    //const prepareMessageDTO = await this.agentGateway.prepareMessageContext(request.researchContextID, request.conversationID, request.message);
    //if (!prepareMessageDTO.success) {
    //this.presenter.presentError({
    //status: "error",
    //operation: "usecase#send-message-to-conversation",
    //message: "",
    //context: {},
    //});
    //return;
    //}

    //this.presenter.presentProgress({
    //status: "progress",
    //message: request.message,
    //progress: "Sending message to agent",
    //context: prepareMessageDTO,
    //});

    //const sendMessageToAgentDTO = await this.agentGateway.sendMessage(prepareMessageDTO.data, request.message);
    //if (!sendMessageToAgentDTO.success) {
    //this.presenter.presentError({
    //status: "error",
    //operation: "usecase#send-message-to-conversation",
    //message: "",
    //context: {},
    //});
    //return;
    //}

    //this.presenter.presentProgress({
    //status: "progress",
    //message: request.message,
    //progress: "Agent replied to the message",
    //context: sendMessageToAgentDTO,
    //});

    //const registerOutgoingMessageDTO = await this.conversationGateway.sendMessageToConversation(request.conversationID, sendMessageToAgentDTO.data);
    //if (!registerOutgoingMessageDTO.success) {
    //this.presenter.presentError({
    //status: "error",
    //operation: "usecase#send-message-to-conversation",
    //message: "",
    //context: {},
    //});
    //return;
    //}

    //this.presenter.presentSuccess({
    //status: "success",
    //message: request.message,
    //response: sendMessageToAgentDTO.data,
    //});
  }
}
