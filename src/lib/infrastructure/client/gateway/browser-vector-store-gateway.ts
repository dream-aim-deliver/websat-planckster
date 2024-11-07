import { injectable } from "inversify";
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from "~/lib/core/dto/vector-store-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";

@injectable()
export default class BrowserVectorStoreGateway  implements VectorStoreOutputPort {
    createVectorStore(files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    getVectorStore(researchContextExternalID: string): Promise<TGetVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }
    deleteVectorStore(researchContextExternalID: string): Promise<TDeleteVectorStoreDTO> {
        throw new Error("Method not implemented.");
    }


}