import { CreateConversationDTO, ListConversationsDTO, SendMessageToConversationResponseDTO, ListMessagesForConversationDTO } from "~/lib/core/dto/conversation-gateway-dto";
import { TMessage } from "~/lib/core/entity/kernel-models";
import ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";

export default class BrowserConversationGateway implements ConversationGatewayOutputPort {
    createConversation(clientID: string, researchContextID: string): Promise<CreateConversationDTO> {
        throw new Error("Method not implemented.");
    }
    listConversations(clientID: string, researchContextID: string): Promise<ListConversationsDTO> {
        throw new Error("Method not implemented.");
    }
    sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO> {
        throw new Error("Method not implemented.");
    }
    getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO> {
        throw new Error("Method not implemented.");
    }
}