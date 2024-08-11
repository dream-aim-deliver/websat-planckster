import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import { OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";

@injectable()
export default class OpenAIVectorStoreGateway implements VectorStoreOutputPort {
    private logger: Logger;
    constructor(
        @inject(UTILS.LOGGER_FACTORY) loggerFactory: (module: string) => Logger,
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI
    ) {
        this.logger = loggerFactory("OpenAIVectorStoreGateway");

    }

    

    __downloadFilesFromKernel(files: RemoteFile[]): Promise<LocalFile[]> {
        throw new Error("Method not implemented.");
    }

    createVectorStore(research_context_id: number, files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    getVectorStore(research_context_id: number): Promise<TGetVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    deleteVectorStore(research_context_id: number): Promise<TDeleteVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
}