import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/infrastructure/trpc/trpc";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import { env } from "~/env";
import OpenAIGateway from "~/lib/infrastructure/server/gateway/openai-gateway";

export const messageRouter = createTRPCRouter({
    list: protectedProcedure
    .input(
        z.object({
            conversationId: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listMessages({
            id: input.conversationId,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const messages = viewModel.message_list
            return messages;
        }
        // TODO: check if error can be handled, otherwise change KP's presenter
        return [];
    }),

    create: protectedProcedure
    .input(
        z.object({
            conversationId: z.number(),
            xAuthToken: z.string(),
            messageContent: z.string(),
        }),
    )
    .mutation(async ({ input }) => {
        // get Unix timestamp for the user's message, as number
        const userMessageTimestamp = Math.floor(new Date().getTime() / 1000); 

        // 1. Use KP to get the first message of a conversation, plus the latest 10
        const viewModel = await sdk.listMessages({
            id: input.conversationId,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });

        if (viewModel.status){
            const allMessages = viewModel.message_list;

            let context: string;
            if (allMessages.length > 0){
                allMessages.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

                const firstMessage = allMessages[0]!;
                const latestMessages = allMessages.slice(-10);

                if (latestMessages.includes(firstMessage)){
                    latestMessages.splice(latestMessages.indexOf(firstMessage), 1);
                }
                // combine both lists
                const messageHistory = [firstMessage, ...latestMessages];

                const messageContents = messageHistory.map((message) => message.content).join("\n");
                
                context = `Take into consideration this history of queries from a user and the responses it got:\n${messageContents}\n`;
            } else {
                context = "";
            }
                const query = `${context}Please answer the following query:\n${input.messageContent}`
            
            // 2. Use OpenAI to send a message
            const openAIGTW = new OpenAIGateway();
            const openAIDTO = await openAIGTW.sendMessage(query);

            if (openAIDTO.status) {
                // assert that we got a response message
                console.log(`Response message: ${openAIDTO.responseMessage}`)
                const responseMessage = openAIDTO.responseMessage!;
                // get the timestamp for the agent's response, as number
                const aiMessageTimestamp = Math.floor(new Date().getTime() / 1000);

                // 3. Register both messages using KP

                // 3.1 Register the user's message
                console.log(userMessageTimestamp)

                const newUserMessageVM = await sdk.createMessage({
                    id: input.conversationId,
                    messageContent: input.messageContent,
                    senderType: "user",
                    unixTimestamp: userMessageTimestamp,
                    xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
                })

                if (newUserMessageVM.status){
                    // 3.2 Register the agent's message
                    const newAgentMessageVM = await sdk.createMessage({
                        id: input.conversationId,
                        messageContent: responseMessage,
                        senderType: "agent",
                        unixTimestamp: aiMessageTimestamp,
                        xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
                    })

                    if (newAgentMessageVM.status){
                        return [newUserMessageVM, newAgentMessageVM];
                    }
                    // TODO: handle registering agent's message error
                    console.error('Error registering agent message:', newAgentMessageVM); 
                    return [];

                }
                // TODO: handle registering user's message error
                console.error('Error registering user message:', newUserMessageVM);
                return [];


            }
            // TODO: handle openAI error
            return [];

        }
        // TODO: handle list messages error
        return [];

    }),

});