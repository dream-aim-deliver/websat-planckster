import { CreateConversationDTO, ListConversationsDTO, ListMessagesForConversationDTO, SendMessageToConversationResponseDTO } from "../../dto/conversation-gateway-dto";
import type { TMessage } from "../../entity/kernel-models";

export default interface ConversationGatewayOutputPort {
    createConversation(clientID: string, researchContextID: string): Promise<CreateConversationDTO>;
    listConversations(clientID: string, researchContextID: string): Promise<ListConversationsDTO>;
    sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO>;
    getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO>;
}