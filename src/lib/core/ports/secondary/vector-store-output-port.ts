import type { TCreateVectorStoreDTO, TDeleteVectorStoreDTO, TGetVectorStoreDTO } from "../../dto/vector-store-dto";
import { File, type RemoteFile } from "../../entity/file";
export default interface VectorStoreOutputPort {
    createVectorStore(research_context_id: number, files: RemoteFile[]): Promise<TCreateVectorStoreDTO>;
    getVectorStore(research_context_id: number): Promise<TGetVectorStoreDTO>;
    deleteVectorStore(research_context_id: number): Promise<TDeleteVectorStoreDTO>;
}