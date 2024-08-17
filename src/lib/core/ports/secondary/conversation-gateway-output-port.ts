import { type CreateConversationDTO, type ListConversationsDTO, type ListMessagesForConversationDTO, type SendMessageToConversationResponseDTO } from "../../dto/conversation-gateway-dto";
import type { TMessage } from "../../entity/kernel-models";

export default interface ConversationGatewayOutputPort {
    createConversation(researchContextID: number, conversationTitle: string): Promise<CreateConversationDTO>;
    listConversations(researchContextID: number): Promise<ListConversationsDTO>;
    sendMessage(conversationID: string, message: TMessage): Promise<SendMessageToConversationResponseDTO>;
    getConversationMessages(conversationID: string): Promise<ListMessagesForConversationDTO>;
}