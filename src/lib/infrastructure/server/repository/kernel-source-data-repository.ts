import { type ListSourceDataDTO, type GetSourceDataDTO, type UploadSourceDataDTO, type DownloadSourceDataDTO, type DeleteSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";

// TODO: only need list and download methods
export default class KernelSourceDataRepository implements SourceDataGatewayOutputPort {
    list(clientID: string): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    listForResearchContext(clientID: string, researchContextID: string): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    get(clientID: string, fileID: string): Promise<GetSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    upload(file: LocalFile, relativePath: string): Promise<UploadSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    download(file: RemoteFile, localPath?: string): Promise<DownloadSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
        throw new Error("Method not implemented.");
    }

}