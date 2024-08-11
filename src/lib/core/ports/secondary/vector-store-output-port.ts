import type { TCreateVectorStoreDTO, TDeleteVectorStoreDTO, TGetVectorStoreDTO } from "../../dto/vector-store-dto";

export default interface VectorStoreOutputPort {
    createVectorStore(research_context_id: number, fileIDs: string[]): Promise<TCreateVectorStoreDTO>;
    getVectorStore(research_context_id: number): Promise<TGetVectorStoreDTO>;
    deleteVectorStore(research_context_id: number): Promise<TDeleteVectorStoreDTO>;
}