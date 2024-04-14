import { env } from "~/env";

import OpenAI from 'openai';

export type openAIDTO = {
    status: boolean;
    code: number;
    errorCode?: number | null;
    errorMessage?: string | null;
    errorName?: string | null;
    errorType?: string | null;
    responseMessage?: string | null;
}

export default class OpenAIGateway {
    private openAIAPIKey: string | undefined;
    private openAIAssistantID: string | undefined;

    constructor() {
        this.openAIAPIKey = env.OPENAI_API_KEY;
        this.openAIAssistantID = env.OPENAI_ASSISTANT_ID;
    }

    async sendMessage(query: string): Promise<openAIDTO> {
        if (!this.openAIAPIKey) throw new Error('OPENAI_API_KEY is not defined in the environment variables')
        
        if (!this.openAIAssistantID) throw new Error('OPENAI_ASSISTANT_ID is not defined in the environment variables')

        const openai = new OpenAI({
            apiKey: this.openAIAPIKey,
        });
        
        try {
            // 1. Always create a new thread
            const thread = await openai.beta.threads.create()

            // 2. Send the message to the new thread
            await openai.beta.threads.messages.create(
                thread.id,
                {
                    role: 'user',
                    content: query,
                    // TODO: think how to upload the source data? it's gonna be a lot
                }
            )

            // 3. Post the run
            const run = await openai.beta.threads.runs.create(
                thread.id,
                {
                    assistant_id: this.openAIAssistantID,
                }
            )

            // 4. Wait until the run is completed or failed
            while (run.status === 'queued' || run.status === 'in_progress') {
            // Wait for 1 second
            await new Promise(r => setTimeout(r, 1000))
            // DEBUG:
            console.log(new Date().toISOString())
            console.log('Waiting for run to complete', run.id)
            console.log('Run Status', run.status)
            console.log('Run', run)
            console.log('------------------')

            // Get the status of the run
            const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
            // If the run had an error, return ErrorDTO
            if (runStatus.status === 'cancelling' || runStatus.status == 'expired' || runStatus.status == 'failed' || runStatus.status == 'cancelled') {
            const errorDTO: openAIDTO = {
                status: false,
                code: 500,
                errorMessage: `POST Run error: ${run.status}}`,
                errorName: 'Run failed',
                errorType: 'gateway_endpoint_error',
            }
            return errorDTO
            }
            // if the run is completed, get the response message
            if (runStatus.status === 'completed') {
                const threadMessages = await openai.beta.threads.messages.list(thread.id)
                const responseMessage = threadMessages.data[-1]?.content.toString()

                const dto: openAIDTO = {
                    status: true,
                    code: 200,
                    responseMessage: responseMessage,
                }

                return dto

            }

        }
        const dto: openAIDTO = {
            status: false,
            code: 500,
            errorMessage: `The Run Status loop did not return any DTOs. Loop ended with run status: ${run.status}`,
            errorName: 'Run failed',
            errorType: 'gateway_endpoint_error',
        }
        return dto

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const dto: openAIDTO = {
                status: false,
                code: 1,
                errorCode: 1,
                errorMessage: errorMessage,
                errorName: "OpenAI Error",
                errorType: "OpenAIError"
            };
            return dto;
        }
    }

}