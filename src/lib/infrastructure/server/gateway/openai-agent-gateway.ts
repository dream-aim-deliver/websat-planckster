import { inject, injectable } from "inversify";
import OpenAI from "openai";
import type { TCreateAgentDTO, TSendMessageDTO } from "~/lib/core/dto/agent-dto";
import type AgentGatewayOutputPort from "~/lib/core/ports/secondary/agent-gateway-output-port";
import { GATEWAYS, KERNEL, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import { TMessage, TMessageContent } from "~/lib/core/entity/kernel-models";
import { Logger } from "pino";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type { TKernelSDK } from "../config/kernel/kernel-sdk";
import { generateOpenAIAssistantIDFromRCExternalID, generateOpenAIAssistantName, generateRCExternalIDFromOpenAIAssistantID, uint8ArrayToBase64 } from "../config/openai/openai-utils";
import { TOpenAIMessageContext } from "../../common/dto/openai-agent-gateway-dto";
import { ListMessagesViewModel_Input, MessageBase_Input } from "@maany_shr/kernel-planckster-sdk-ts";
import { kernelMessageToWebsatMessage } from "../config/kernel/kernel-utils";
import path from "path";
import fs from "fs";
import { Message as OpenAIMessage } from "openai/resources/beta/threads/messages.mjs";

@injectable()
export default class OpenAIAgentGateway implements AgentGatewayOutputPort<TOpenAIMessageContext> {
  private logger: Logger;
  constructor(
    @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    @inject(GATEWAYS.AUTH_GATEWAY) private AuthGateway: AuthGatewayOutputPort,
    @inject(KERNEL.KERNEL_SDK) private KernelSDK: TKernelSDK,
  ) {
    this.logger = loggerFactory("OpenAIAgentGateway");
  }
  async createAgent(researchContextTitle: string, researchContextDescription: string, vectorStoreID: string): Promise<TCreateAgentDTO> {
    const instructions = `You are an expert data analyst specialized in ${researchContextTitle}. Your research context can be best described by ${researchContextDescription}. You will help me and my team explore and analize some datasets that we have augmented, by combining data from satellites, twitter, and telegram, regarding the occurrence of disaster events related to ${researchContextTitle} at different locations. You have access to a code interpreter to generate insights from the data, and a file search tool to find relevant datasets.`;
    const model = "gpt-4o";
    const agentName = generateOpenAIAssistantName();
    try {
      const openaiAgent = await this.openai.beta.assistants.create({
        model: model,
        name: agentName,
        description: researchContextDescription,
        instructions: instructions,
        tools: [{ type: "code_interpreter" }, { type: "file_search" }],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStoreID],
          },
        },
      });
      const researchContextExternalID = generateRCExternalIDFromOpenAIAssistantID(openaiAgent.id);

      this.logger.info({ openaiAgent }, "Agent created");
      return {
        success: true,
        data: {
          externalID: researchContextExternalID,
          provider: "openai",
          model: model,
          vectorStoreID: vectorStoreID,
          tools: ["code_interpreter", "file_search"],
          resources: {
            vector_stores: [vectorStoreID],
          },
          instructions: instructions,
        },
      };
    } catch (error) {
      this.logger.error({ error }, "Failed to create agent");
      return {
        success: false,
        data: {
          message: "Failed to create agent",
          operation: "openai:create-agent",
        },
      };
    }
  }

  async prepareMessageContext(researchContextExternalID: string, conversationID: number): Promise<{ data: { assistantID: string; messagesToSend: TMessage[] }; success: true } | { data: { message: string; operation: string }; success: false }> {
    try {
      const kpCredentialsDTO = await this.AuthGateway.extractKPCredentials();
      if (!kpCredentialsDTO.success) {
        this.logger.error({ kpCredentialsDTO }, "Failed to extract KP credentials from session");
        return {
          success: false,
          data: {
            message: "Failed to extract KP credentials from session",
            operation: "openai:prepare-message-context",
          },
        };
      }

      // 1. Get OpenAI Agent via research context external ID
      const openaiAssistantID = generateOpenAIAssistantIDFromRCExternalID(researchContextExternalID);
      const openaiAgent = await this.openai.beta.assistants.retrieve(openaiAssistantID);

      if (!openaiAgent) {
        this.logger.error({ researchContextExternalID }, "Agent not found");
        return {
          success: false,
          data: {
            message: "Agent not found",
            operation: "openai:prepare-message-context",
          },
        };
      }

      const openaiAgentID = openaiAgent.id;

      // 2. Prepare messages to be sent
      const getSessionDTO = await this.AuthGateway.getSession();
      if (!getSessionDTO.success) {
        this.logger.error({ getSessionDTO }, "Failed to get session");
        return {
          success: false,
          data: {
            message: "Failed to get session",
            operation: "openai:prepare-message-context",
          },
        };
      }

      const listMessagesKPViewModel: ListMessagesViewModel_Input = await this.KernelSDK.listMessages({ id: conversationID, xAuthToken: kpCredentialsDTO.data.xAuthToken });

      if (!listMessagesKPViewModel.status) {
        this.logger.error({ listMessagesKPViewModel }, "Failed to list messages");
        return {
          success: false,
          data: {
            message: "Failed to list messages",
            operation: "openai:prepare-message-context",
          },
        };
      }

      const kpAllMessages: MessageBase_Input[] = listMessagesKPViewModel.message_list;

      let messagesToSend: TMessage[] = [];

      if (kpAllMessages.length > 0) {
        const firstKPMessage = kpAllMessages[0];
        if (firstKPMessage) {
          const firstMessage = kernelMessageToWebsatMessage(firstKPMessage);
          messagesToSend.push(firstMessage);
        }
      }

      const lastTenMessages: TMessage[] = kpAllMessages.slice(-10).map((message) => kernelMessageToWebsatMessage(message));

      messagesToSend = messagesToSend.concat(lastTenMessages);

      // 3. Return message context
      return {
        success: true,
        data: {
          assistantID: openaiAgentID,
          messagesToSend: messagesToSend,
        },
      };
    } catch (error) {
      this.logger.error({ error }, "Failed to prepare message context");
      return {
        success: false,
        data: {
          message: "Failed to prepare message context",
          operation: "openai:prepare-message-context",
        },
      };
    }
  }

  async sendMessage(context: { assistantID: string; messagesToSend: TMessage[] }, message: TMessage): Promise<TSendMessageDTO> {
    try {
      this.logger.info({ message }, "Sending message to OpenAI");
      const { assistantID, messagesToSend: contextMessagesToSend } = context;

      // 1. Create thread
      const openaiThread = await this.openai.beta.threads.create();
      const openaiThreadID = openaiThread.id;

      // 2. Craft a message file with all contents
      // for images, upload to OpenAI, get file ID, and inject the file ID in the message
      const conversationContext: string[] = [];

      if (contextMessagesToSend.length > 0) {
        conversationContext.push(
          `Please consider as context that this conversation has had the following messages. The first one is the first message that the user sent to the conversation, followed by up to the latest 10 messages sent in the conversation. Each message in the list starts with "=>", followed by the sender type ('user' or 'assistant'), the message type ('text', 'image', or 'citation'), and the message contents. If the message is an image, the content will be an image file ID that is already available to you. The messages are separated by two new lines, and, in the end, you'll find the message you have to respond to marked with "=> NEW MESSAGE":\n`,
        );

        for (const contextMessage of contextMessagesToSend) {
          for (const content of contextMessage.message_contents) {
            if (content.content_type === "text") {
              // Add text to conversation file content
              conversationContext.push(`=> ${contextMessage.sender_type == "agent" ? "assistant" : "user"} -- text: ${content.content}`);
            } else if (content.content_type === "image") {
              // Save image to file
              const imageBase64 = content.content;
              const buffer = Buffer.from(imageBase64, "base64");
              const filePath = path.join(process.cwd(), "temp", `image-${content.id}.png`);
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
              fs.writeFileSync(filePath, buffer);

              // Upload image to OpenAI
              const openaiFile = await this.openai.files.create({
                file: fs.createReadStream(filePath),
                purpose: "assistants",
              });

              // Cleanup
              fs.unlinkSync(filePath);

              // Add file ID to conversation file content
              conversationContext.push(`${contextMessage.sender_type == "agent" ? "assistant" : "user"} -- image: ${openaiFile.id}`);
            } else if (content.content_type === "citation") {
              // Add citation to conversation file content
              conversationContext.push(`${contextMessage.sender_type == "agent" ? "assistant" : "user"} -- citation: ${content.content}`);
            }
          }
        }
      }

      // 3. Wrap the new message with the context string
      this.logger.info({ conversationFileContent: conversationContext }, "Conversation file content");

      const newMessageContent = message.message_contents.map((content) => `${content.content}`).join("\n");
      conversationContext.push(`=> NEW MESSAGE -- ${message.sender_type == "agent" ? "assistant" : "user"} -- text: ${newMessageContent}`);

      const messageToSend = conversationContext.join("\n\n");

      const newThreadMessage = await this.openai.beta.threads.messages.create(openaiThreadID, {
        role: "user",
        content: messageToSend,
      });

      // 4. Post run to the thread and wait
      const run = await this.openai.beta.threads.runs.create(openaiThreadID, {
        assistant_id: assistantID,
      });
      while (run.status === "queued" || run.status === "in_progress") {
        this.logger.info({ run }, "Waiting for run to complete\n------------------");
        await new Promise((r) => setTimeout(r, 1000));

        const runStatus = await this.openai.beta.threads.runs.retrieve(openaiThreadID, run.id);

        // CANCELLED CASE
        if (runStatus.status === "cancelling" || runStatus.status == "expired" || runStatus.status == "failed" || runStatus.status == "cancelled") {
          this.logger.error({ runStatus }, "Run failed");
          return {
            success: false,
            data: {
              message: "OpenAI Run failed",
              operation: "openai:send-message",
            },
          };
        }

        // COMPLETED CASE
        if (runStatus.status === "completed") {
          this.logger.info("Run completed");
          const openAIMessages = await this.openai.beta.threads.messages.list(openaiThreadID);

          // Grab all but the first message
          this.logger.debug({ openAIMessages }, "OpenAI messages");
          const newOpenAIMessages: OpenAIMessage[] = openAIMessages.data.slice(0, -1);

          if (!newOpenAIMessages) {
            this.logger.error({ openAIMessages }, "OpenAI returned no new messages, but run was completed.");
            return {
              success: false,
              data: {
                message: "No messages returned by OpenAI after run completed",
                operation: "openai:send-message",
              },
            };
          }

          // 5. Craft new message for Kernel and return
          const newMessageContents: TMessageContent[] = [];

          for (const newOpenAIMessage of newOpenAIMessages) {
            for (const newOpenAIMessageContent of newOpenAIMessage.content) {
              if (newOpenAIMessageContent.type === "text") {
                newMessageContents.push({ content: newOpenAIMessageContent.text.value, content_type: "text" });
              } else if (newOpenAIMessageContent.type === "image_file") {
                const fileId = newOpenAIMessageContent.image_file.file_id;
                const file = await this.openai.files.content(fileId);
                const bufferView = new Uint8Array(await file.arrayBuffer());
                const base64 = uint8ArrayToBase64(bufferView);
                newMessageContents.push({ content: base64, content_type: "image" });
              } else if (newOpenAIMessageContent.type === "image_url") {
                // TODO: maybe download the image and save it as base64; handle broken links
                newMessageContents.push({ content: newOpenAIMessageContent.image_url.url, content_type: "text" });
              } else if (newOpenAIMessageContent.type === "refusal") {
                newMessageContents.push({
                  content: newOpenAIMessageContent.refusal,
                  content_type: "text",
                });
              }
            }
          }

          if (!newMessageContents) {
            this.logger.error({ newOpenAIMessages }, "OpenAI returned no message contents");
            return {
              success: false,
              data: {
                message: "No message contents returned by OpenAI after run completed",
                operation: "openai:send-message",
              },
            };
          }

          const newMessage: TMessage = {
            sender: "agent", // TODO: this will come from Kernel later
            sender_type: "agent",
            message_contents: newMessageContents,
          };

          this.logger.info({ newMessage }, "Message received from OpenAI successfully");
          return {
            success: true,
            data: newMessage,
          };
        }
      }
      this.logger.error({ run }, "Run was not completed for an unexpected reason");
      return {
        success: false,
        data: {
          message: "Run was not completed for an unexpected reason",
          operation: "openai:send-message",
        },
      };
    } catch (error) {
      this.logger.error({ error }, "Failed to send message");
      return {
        success: false,
        data: {
          message: "Failed to send message",
          operation: "openai:send-message",
        },
      };
    }
  }
}
