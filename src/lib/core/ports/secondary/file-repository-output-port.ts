import type { DownloadFileDTO, UploadFileDTO } from "../../dto/file-repository-dto";
import type { LocalFile, RemoteFile } from "../../entity/file";

export default interface FileRepositoryOutputPort {
    uploadFile(file: LocalFile, remotePath?: string): Promise<UploadFileDTO>;
    downloadFile( file: RemoteFile, localPath: string) : Promise<DownloadFileDTO>;
}