import type { TCreateVectorStoreDTO, TDeleteVectorStoreDTO, TGetVectorStoreDTO } from "../../dto/vector-store-dto";
import { type RemoteFile } from "../../entity/file";
export default interface VectorStoreOutputPort {
  createVectorStore(files: RemoteFile[]): Promise<TCreateVectorStoreDTO>;
  getVectorStore(researchContextExternalID: string): Promise<TGetVectorStoreDTO>;
  deleteVectorStore(researchContextExternalID: string): Promise<TDeleteVectorStoreDTO>;
}
