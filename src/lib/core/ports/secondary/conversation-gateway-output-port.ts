import { type CreateConversationDTO, type ListConversationsDTO, type ListMessagesForConversationDTO, type SendMessageToConversationResponseDTO } from "../../dto/conversation-gateway-dto";
import type { TMessage } from "../../entity/kernel-models";

export default interface ConversationGatewayOutputPort {
    createConversation(researchContextID: string, conversationTitle: string): Promise<CreateConversationDTO>;
    listConversations(researchContextID: string): Promise<ListConversationsDTO>;
    sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO>;
    getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO>;
}