import type { CreateConversationDTO, ListConversationsDTO, ListMessagesForConversationDTO, SendMessageToConversationResponseDTO } from "../../dto/conversation-gateway-dto";
import type { TMessage } from "../../entity/kernel-models";

export default interface ConversationGatewayOutputPort {
    createConversation(researchContextID: number, conversationTitle: string): Promise<CreateConversationDTO>;
    listConversations(researchContextID: number): Promise<ListConversationsDTO>;
    sendMessageToConversation(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO>;
    listMessagesForConversation(conversationID: number): Promise<ListMessagesForConversationDTO>;
}