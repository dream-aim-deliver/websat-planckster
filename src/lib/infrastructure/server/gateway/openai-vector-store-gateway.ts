import { injectable } from "inversify";
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";

@injectable()
export default class OpenAIVectorStoreGateway implements VectorStoreOutputPort {
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