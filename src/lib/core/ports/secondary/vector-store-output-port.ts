import type { CreateVectorStoreDTO, GetVectorStoreDTO, DeleteVectorStoreDTO, UpdateVectorStoreDTO } from "../../dto/vector-store-dto";

export default interface VectorStoreOutputPort {
    createVectorStore(research_context_id: number, fileIDs: string[]): Promise<CreateVectorStoreDTO>;
    getVectorStore(research_context_id: number): Promise<GetVectorStoreDTO>;
    deleteVectorStore(research_context_id: number): Promise<DeleteVectorStoreDTO>;
    updateVectorStore(research_context_id: number): Promise<UpdateVectorStoreDTO>;
}