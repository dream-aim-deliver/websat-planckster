/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from "inversify";
import { ILogObj, Logger } from "tslog";
import { type TCreateAgentDTO, type TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import { type TMessage } from "~/lib/core/entity/kernel-models";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import { type TVanillaAPI } from "../trpc/vanilla-api";
import { TOpenAIMessageContext } from "../../common/dto/openai-agent-gateway-dto";
import { RemoteFile } from "~/lib/core/entity/file";

@injectable()
export default class BrowserAgentGateway implements AgentGatewayOutputPort<TOpenAIMessageContext> {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("AgentGateway");
  }

  async createAgent(researchContextTitle: string, researchContextDescription: string, vectorStoreID: string, additionalFiles?: RemoteFile[]): Promise<TCreateAgentDTO> {
    try {
      const dto = this.api.gateways.agent.create.mutate({
        researchContextTitle,
        researchContextDescription,
        vectorStoreID,
        additionalFiles,
      });
      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to create agent");

      return {
        success: false,
        data: {
          operation: "browser#agent#create",
          message: "Could not invoke the server side feature to create agent",
        },
      };
    }
  }

  async prepareMessageContext(researchContextExternalID: string, conversationID: number): Promise<{ data: { assistantID: string; messagesToSend: TMessage[] }; success: true } | { data: { message: string; operation: string }; success: false }> {
    try {
      const dto = await this.api.gateways.agent.prepareMessageContext.query({
        researchContextExternalID,
        conversationID,
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
  async sendMessage(context: { assistantID: string; messagesToSend: TMessage[] }, message: TMessage): Promise<TSendMessageDTO> {
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
