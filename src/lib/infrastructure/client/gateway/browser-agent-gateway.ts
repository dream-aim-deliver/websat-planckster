/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { type TCreateAgentDTO, type TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { type TMessage } from "~/lib/core/entity/kernel-models";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import { type TBaseDTO } from "~/sdk/core/dto";

@injectable()
export default class BrowserAgentGateway<T extends TBaseDTO<any,any>> implements AgentGatewayOutputPort<T> {
    createAgent(researchContextID: number): Promise<TCreateAgentDTO> {
        throw new Error("Method not implemented.");
    }
    prepareMessageContext(researchContextID: string, conversationID: string, message: TMessage): Promise<T> {
        throw new Error("Method not implemented.");
    }
    sendMessage(context: T["data"], message: TMessage): Promise<TSendMessageDTO> {
        throw new Error("Method not implemented.");
    }
}