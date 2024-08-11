import type { DeleteSourceDataDTO, GetSourceDataDTO, ListSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
/**
 * Represents the output port for the SourceDataRepository.
 * This interface defines the methods for retrieving, listing, and deleting source data.
 */
export default interface SourceDataRepositoryOutputPort {
    list(clientID: string): Promise<ListSourceDataDTO>;
    listForResearchContext(clientID: string, researchContextID: string): Promise<ListSourceDataDTO>;
    get(clientID: string, fileID: string): Promise<GetSourceDataDTO>;
    upload(file: LocalFile, relativePath: string): Promise<GetSourceDataDTO>;
    download(file: RemoteFile, localPath?: string): Promise<GetSourceDataDTO>;
    delete(file: RemoteFile): Promise<DeleteSourceDataDTO>;
}
