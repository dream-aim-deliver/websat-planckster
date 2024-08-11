import { SendMessageToConversationInputPort, SendMessageToConversationOutputPort } from "../ports/primary/send-message-to-conversation-primary-ports";
import AgentGatewayOutputPort from "../ports/secondary/agent-gateway-output-port";
import ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";
import { TSendMessageToConversationRequest } from "../usecase-models/send-message-to-conversation-usecase-models";

export default class SendMessageToConversationUseCase implements SendMessageToConversationInputPort {
    presenter: SendMessageToConversationOutputPort<any>;
    agentGateway: AgentGatewayOutputPort<any>;
    conversationGateway: ConversationGatewayOutputPort;
    constructor(presenter: SendMessageToConversationOutputPort<any>, agentGateway: AgentGatewayOutputPort<any>, conversationGateway: ConversationGatewayOutputPort) {
        this.presenter = presenter;
        this.agentGateway = agentGateway
        this.conversationGateway = conversationGateway;
    }

    async execute(request: TSendMessageToConversationRequest): Promise<void> {
        // TODO: check if conversation exists
        // send incoming message to the conversation
        const registerIncomingMessageDTO = await this.conversationGateway.sendMessage(request.conversationID, request.message)

        if (!registerIncomingMessageDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#send-message-to-conversation",
                    message: "",
                    context: {}
                }
            )
            return;
        }

        const prepareMessageDTO = await this.agentGateway.prepareMessageContext(request.clientID, request.researchContextID, request.conversationID, request.message)
        if (!prepareMessageDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#send-message-to-conversation",
                    message: "",
                    context: {}
                }
            )
            return;
        }

        this.presenter.presentProgress({
            message: request.message,
            progress: "Sending message to agent",
            context: prepareMessageDTO
        })

        const sendMessageToAgentDTO = await this.agentGateway.sendMessage(prepareMessageDTO.data, request.message)
        if (!sendMessageToAgentDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#send-message-to-conversation",
                    message: "",
                    context: {}
                }
            )
            return;
        }

        this.presenter.presentProgress({
            message: request.message,
            progress: "Agent replied to the message",
            context: sendMessageToAgentDTO
        })

        const registerOutgoingMessageDTO = await this.conversationGateway.sendMessage(request.conversationID, sendMessageToAgentDTO.data)
        if (!registerOutgoingMessageDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#send-message-to-conversation",
                    message: "",
                    context: {}
                }
            )
            return;
        }

        this.presenter.presentSuccess({
            message: request.message,
            response: sendMessageToAgentDTO.data
        })
    }
}