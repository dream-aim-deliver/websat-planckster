import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { CreateVectorStoreDTO, GetVectorStoreDTO, DeleteVectorStoreDTO, UpdateVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import type VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import { OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";

@injectable()
export default class OpenAIVectorRepository implements VectorStoreOutputPort{
    private logger: Logger;
    constructor(
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI    
    ) {
        this.logger = loggerFactory("OpenAIVectorRepository");
    }
    updateVectorStore(research_context_id: number): Promise<UpdateVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    async createVectorStore(research_context_id: number, fileIDs: string[]): Promise<CreateVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    getVectorStore(research_context_id: number): Promise<GetVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    deleteVectorStore(research_context_id: number): Promise<DeleteVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    
}

