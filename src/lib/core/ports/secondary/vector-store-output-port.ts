import type { TCreateVectorStoreDTO, TDeleteVectorStoreDTO, TGetVectorStoreDTO } from "../../dto/vector-store-dto";
import { type RemoteFile } from "../../entity/file";
export default interface VectorStoreOutputPort {
  createVectorStore(vectorStoreID: string, files: RemoteFile[]): Promise<TCreateVectorStoreDTO>;
  addFilesToVectorStore(vectorStoreID: string, files: RemoteFile[]): Promise<TCreateVectorStoreDTO>;
  getVectorStore(vectorStoreID: string): Promise<TGetVectorStoreDTO>;
  deleteVectorStore(vectorStoreID: string): Promise<TDeleteVectorStoreDTO>;
}
