import type { DeleteSourceDataDTO, DownloadSourceDataDTO, GetSourceDataDTO, ListSourceDataDTO, UploadSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
/**
 * Represents the output port for the SourceDataGateway.
 * This interface defines the methods for retrieving, listing, and deleting source data.
 */
export default interface SourceDataGatewayOutputPort {
    list(): Promise<ListSourceDataDTO>;
    listForResearchContext(researchContextID: string): Promise<ListSourceDataDTO>;
    get(fileID: string): Promise<GetSourceDataDTO>;
    upload(file: LocalFile, relativePath: string): Promise<UploadSourceDataDTO>;
    download(file: RemoteFile, localPath?: string): Promise<DownloadSourceDataDTO>;
    delete(file: RemoteFile): Promise<DeleteSourceDataDTO>;
}
