import { injectable } from "inversify";
import type { ListSourceDataDTO, GetSourceDataDTO, DeleteSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type SourceDataRepositoryOutputPort from "~/lib/core/ports/secondary/source-data-repository-output-port";

@injectable()
export default class BrowserSourceDataRepository implements SourceDataRepositoryOutputPort {
    listForResearchContext(clientID: string, researchContextID: string): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }

    list(clientID: string, researchContextID?: string): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    get(clientID: string, fileID: string): Promise<GetSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    upload(file: LocalFile, relativePath: string): Promise<GetSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    download(file: RemoteFile, localPath?: string): Promise<GetSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
}