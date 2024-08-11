import type { CreateAgentDTO } from "~/lib/core/dto/agent-dto";

export default interface AgentGatewayOutputPort {
    createAgent(research_context_id: number): Promise<CreateAgentDTO>;
    //prepareMessage(clientID: string, researchContextID: string, conversationID: string, message: string): Promise<void>;
    //sendMessageToAgent(research_context_id: number, agent_id: number, message: string): Promise<SendMessageToAgentDTO>;
}