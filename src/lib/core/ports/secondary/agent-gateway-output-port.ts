import type { TCreateAgentDTO, TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { type TMessage } from "../../entity/kernel-models";
import { type TBaseDTO, TBaseErrorDTOData } from "~/sdk/core/dto";

export default interface AgentGatewayOutputPort<TPrepareContext extends TBaseDTO<any,any>> {
    createAgent(clientID: string, researchContextID: number): Promise<TCreateAgentDTO>;
    prepareMessageContext(clientID: string, researchContextID: string, conversationID: string, message: TMessage): Promise<TPrepareContext>;
    sendMessage(context: TPrepareContext["data"], message: TMessage): Promise<TSendMessageDTO>;
}