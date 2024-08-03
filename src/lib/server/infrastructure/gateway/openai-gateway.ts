
import { env } from "~/env";

import OpenAI from 'openai';

export type openaiDTO = {
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

    uint8ArrayToBase64(uint8Array: Uint8Array): string {
        // Convert the Uint8Array to a binary string
        let binaryString = '';
        uint8Array.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
        });
    
        // Use btoa to convert the binary string to base64
        return btoa(binaryString);
    }

    async sendMessage(query: string): Promise<openaiDTO> {
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
            const errorDTO: openaiDTO = {
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

                console.log('Run completed')

                let page = await openai.beta.threads.messages.list(thread.id); 
                let items  = page.getPaginatedItems();
                while(page.hasNextPage()) {
                    page = await page.getNextPage();
                    items = items.concat(page.getPaginatedItems());
                }
                // TIP: For handling images, see https://community.openai.com/t/how-do-download-files-generated-in-ai-assistants/493516/3
                const messages = [];
                for (const item of items) {
                    const content = item.content;
                    for ( const message of content) {

                        console.log(message)

                        if (message.type === 'image_file') {
                            console.log("image message")

                            const fileId = message.image_file.file_id;
                            const file = await openai.files.content(fileId);
                            const bufferView = new Uint8Array(await file.arrayBuffer());
                            const base64 = this.uint8ArrayToBase64(bufferView);
                            messages.push({
                                "content": base64,
                                "role": item.role === 'user' ? 'user' : 'agent',
                                "type": 'image',
                                "timestamp": item.created_at
                            })
                        } else if (message.type === 'text') {
                            console.log("text message")
                            messages.push({
                                "content": message.text.value,
                                "role": item.role === 'user' ? 'user' : 'agent',
                                "type": 'text',
                                "timestamp": item.created_at
                            })
                        }
                    }}
                messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                const lastMessage = messages.slice(-1);
                const lastMessageContent = lastMessage[0]!.content;
                console.log(`Last message: ${lastMessageContent}`);

                const dto: openaiDTO = {
                    status: true,
                    code: 200,
                    responseMessage: lastMessageContent,
                }

                return dto

            }

        }
        const dto: openaiDTO = {
            status: false,
            code: 500,
            errorMessage: `The Run Status loop did not return any DTOs. Loop ended with run status: ${run.status}`,
            errorName: 'Run failed',
            errorType: 'gateway_endpoint_error',
        }
        return dto

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const dto: openaiDTO = {
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