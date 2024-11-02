/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TCreateAgentDTO, TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { type TMessage } from "../../entity/kernel-models";
import { type TBaseDTO } from "~/sdk/core/dto";

export default interface AgentGatewayOutputPort<TPrepareContext extends TBaseDTO<any,any>> {
    createAgent(researchContextID: number, researchContextName: string, researchContextDesciption: string, vectorStoreID: string ): Promise<TCreateAgentDTO>;
    prepareMessageContext(researchContextID: number, conversationID: number): Promise<TPrepareContext>;
    sendMessage(context: TPrepareContext["data"], message: TMessage): Promise<TSendMessageDTO>;
}