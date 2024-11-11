/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TCreateAgentDTO, TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { type TMessage } from "../../entity/kernel-models";
import { type TBaseDTO } from "~/sdk/core/dto";
import { type RemoteFile } from "../../entity/file";

export default interface AgentGatewayOutputPort<TPrepareContext extends TBaseDTO<any, any>> {
  createAgent(researchContextTitle: string, researchContextDescription: string, vectorStoreID: string, additionalFiles?: RemoteFile[], agentSystemInstructions?: string): Promise<TCreateAgentDTO>;
  prepareMessageContext(researchContextExternalID: string, conversationID: number): Promise<TPrepareContext>;
  sendMessage(context: TPrepareContext["data"], message: TMessage): Promise<TSendMessageDTO>;
}
