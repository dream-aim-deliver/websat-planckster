import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { CONTROLLERS, UTILS } from "../../../config/ioc/server-ioc-symbols";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import { type Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import type ListMessagesForConversationController from "../../../controller/list-messages-for-conversation-controller";

export const messageRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        conversationID: z.number(),
      }),
    )
    .query(async ({ input }) => {

      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY)

      const logger = loggerFactory("ListConversations TRPC Router")

      const signalFactory = signalsContainer.get<(initialValue: TListMessagesForConversationViewModel, update?: (value: TListMessagesForConversationViewModel) => void) => Signal<TListMessagesForConversationViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_MESSAGES_FOR_CONVERSATION)

      const response: Signal<TListMessagesForConversationViewModel> = signalFactory({
        status: "request",
        conversationID: input.conversationID
      })

      try {
        const controller = serverContainer.get<ListMessagesForConversationController>(CONTROLLERS.LIST_MESSAGES_CONTROLLER)

        await controller.execute({
          response: response,
          conversationID: input.conversationID
        })
        
        return response;

      } catch (error) {
        response.update({
          status: "error",
          message: "Could not invoke the server side feature to list messages for conversation",
        })
        logger.error({ error }, "Could not invoke the server side feature to list messages for conversation")

        return response;
      }
    }),


    // OLD CODE
    // create: protectedProcedure
    // .input(
    //     z.object({
    //         conversationId: z.number(),
    //         messageContent: z.string(),
    //     }),
    // )
    // .mutation(async ({ input }) => {

    //     const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
    //     const kpCredentialsDTO = await authGateway.extractKPCredentials();

    //     if (!kpCredentialsDTO.success) {
    //         return [];
    //     }

    //     // get Unix timestamp for the user's message, as number
    //     const userMessageTimestamp = Math.floor(new Date().getTime() / 1000); 

    //     // 1. Use KP to get the first message of a conversation, plus the latest 10
    //     const viewModel = await sdk.listMessages({
    //         id: input.conversationId,
    //         xAuthToken: kpCredentialsDTO.data.xAuthToken, 
    //     });

    //     if (viewModel.status){
    //         const allMessages = viewModel.message_list;

    //         let context: string;
    //         if (allMessages.length > 0){
    //             allMessages.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

    //             const firstMessage = allMessages[0]!;
    //             const latestMessages = allMessages.slice(-10);

    //             if (latestMessages.includes(firstMessage)){
    //                 latestMessages.splice(latestMessages.indexOf(firstMessage), 1);
    //             }
    //             // combine both lists
    //             const messageHistory = [firstMessage, ...latestMessages];

    //             const messageContents = messageHistory.map((message) => message.content).join("\n");
                
    //             context = `Take into consideration this history of queries from a user and the responses it got:\n${messageContents}\n`;
    //         } else {
    //             context = "";
    //         }
    //             const query = `${context}Please answer the following query:\n${input.messageContent}`
            
    //         // 2. Use OpenAI to send a message
    //         const openAIGTW = new OpenAIGateway();
    //         const openAIDTO = await openAIGTW.sendMessage(query);

    //         if (openAIDTO.status) {
    //             // assert that we got a response message
    //             console.log(`Response message: ${openAIDTO.responseMessage}`)
    //             const responseMessage = openAIDTO.responseMessage!;
    //             // get the timestamp for the agent's response, as number
    //             const aiMessageTimestamp = Math.floor(new Date().getTime() / 1000);

    //             // 3. Register both messages using KP

    //             // 3.1 Register the user's message
    //             console.log(userMessageTimestamp)

    //             const newUserMessageVM = await sdk.createMessage({
    //                 id: input.conversationId,
    //                 messageContent: input.messageContent,
    //                 senderType: "user",
    //                 unixTimestamp: userMessageTimestamp,
    //                 xAuthToken: kpCredentialsDTO.data.xAuthToken,
    //             })

    //             if (newUserMessageVM.status){
    //                 // 3.2 Register the agent's message
    //                 const newAgentMessageVM = await sdk.createMessage({
    //                     id: input.conversationId,
    //                     messageContent: responseMessage,
    //                     senderType: "agent",
    //                     unixTimestamp: aiMessageTimestamp,
    //                     xAuthToken:  kpCredentialsDTO.data.xAuthToken,
    //                 })

    //                 if (newAgentMessageVM.status){
    //                     return [newUserMessageVM, newAgentMessageVM];
    //                 }
    //                 // TODO: handle registering agent's message error
    //                 console.error('Error registering agent message:', newAgentMessageVM); 
    //                 return [];

    //             }
    //             // TODO: handle registering user's message error
    //             console.error('Error registering user message:', newUserMessageVM);
    //             return [];


    //         }
    //         // TODO: handle openAI error
    //         return [];

    //     }
    //     // TODO: handle list messages error
    //     return [];

    // }),



})