import type { DownloadFileDTO, UploadFileDTO } from "../../dto/remote-storage-repository-dto";
import type { LocalFile, RemoteFile } from "../../entity/file";

export default interface RemoteStorageElementOutputPort {
    uploadFile(file: LocalFile, remotePath?: string): Promise<UploadFileDTO>;
    downloadFile( file: RemoteFile, localPath: string) : Promise<DownloadFileDTO>;
}