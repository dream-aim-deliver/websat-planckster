/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from "inversify";
import { ILogObj, Logger } from "tslog";
import { type TCreateAgentDTO, type TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { type TMessage } from "~/lib/core/entity/kernel-models";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import { TOpenAIMessageContext } from "../../common/dto/openai-agent-gateway-dto";

@injectable()
export default class BrowserAgentGateway implements AgentGatewayOutputPort<TOpenAIMessageContext> {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("AgentGateway");
  }

  async createAgent(researchContextID: number): Promise<TCreateAgentDTO> {
    throw new Error("Method not implemented.");
  }

  async prepareMessageContext(researchContextID: number, conversationID: number, message: TMessage): Promise<{ data: { threadID: string }; success: true } | { data: { message: string; operation: string }; success: false }> {
    try {
      const dto = await this.api.gateways.agent.prepareMessageContext.query({
        researchContextID,
        conversationID,
        message,
      });

      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to prepare message context");

      return {
        success: false,
        data: {
          operation: "browser#agent#prepare-message-context",
          message: "Could not invoke the server side feature to prepare message context",
        },
      };
    }
  }
  async sendMessage(context: { threadID: string } | { message: string; operation: string }, message: TMessage): Promise<TSendMessageDTO> {
    try {
      const dto = await this.api.gateways.agent.sendMessage.mutate({
        context,
        message,
      });
      this.logger.debug({ dto }, `Successfully retrieved response from server for sending message to conversation`);

      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to send message to conversation");

      return {
        success: false,
        data: {
          operation: "browser#agent#send-message",
          message: "Could not invoke the server side feature to send message to conversation",
        },
      };
    }
  }
}
