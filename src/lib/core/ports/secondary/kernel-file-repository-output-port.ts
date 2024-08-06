import { type GetDownloadSignedUrlDTO, type GetUploadSignedUrlDTO } from "../../dto/kernel-file-repository-dto";

export default interface KernelFileRepositoryOutputPort {
    getUploadSignedUrl(protocol: string, relativePath: string): Promise<GetUploadSignedUrlDTO>;
    getDownloadSignedUrl(protocol: string, relativePath: string): Promise<GetDownloadSignedUrlDTO>;
}