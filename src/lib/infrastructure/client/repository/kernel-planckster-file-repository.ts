import path from "path";
import axios from "axios";

import { inject, injectable } from "inversify";
import KernelFileRepositoryOutputPort from "~/lib/core/ports/secondary/kernel-file-repository-output-port";
import { TRPC } from "../config/ioc/client-ioc-symbols";
import { type TClientComponentAPI } from "../trpc/react-api";
import { GetDownloadSignedUrlDTO, GetUploadSignedUrlDTO } from "~/lib/core/dto/kernel-file-repository-dto";
import { UploadFileDTO, DownloadFileDTO } from "~/lib/core/dto/file-repository-dto";
import { LocalFile, RemoteFile } from "~/lib/core/entity/file";


@injectable()
export default class KernelFileClientRepository implements KernelFileRepositoryOutputPort {

    constructor(
        @inject(TRPC.REACT_CLIENT_COMPONENTS_API) private api: TClientComponentAPI
    ) {
        this.api = api;
    }

    async getUploadSignedUrl(protocol: string, relativePath: string): Promise<GetUploadSignedUrlDTO> {
        try {

            const getUploadSignedUrlQuery = this.api.kernel.sourceData.getUploadSignedUrl.useQuery({
                protocol: protocol,
                relativePath: relativePath,
            });

            if (getUploadSignedUrlQuery.error) {
                return {
                    success: false,
                    data: {
                        message: `An error occurred. TRPC server query failed: ${JSON.stringify(getUploadSignedUrlQuery.error)}`,
                        operation: "kp#get-upload-signed-url",
                    }
                }
            }

            const signedUrl = getUploadSignedUrlQuery.data;

            if (!signedUrl || signedUrl.length === 0 || typeof signedUrl !== 'string') {
                return {
                    success: false,
                    data: {
                        message: `An error occurred. Signed URL received from TRPC server is null: ${getUploadSignedUrlQuery.error}`,
                        operation: "kp#get-upload-signed-url",
                    }
                }
            }

            return {
                success: true,
                data: {
                    type: "upload-signed-url",
                    url: signedUrl
                }
            }

        } catch (error: unknown) {
            const err = error as Error;
            return {
                success: false,
                data: {
                    message: `An error occurred. Error: ${err.message}`,
                    operation: "kp#get-upload-signed-url",
                }
            }
        }

    }

    async getDownloadSignedUrl(protocol: string, relativePath: string): Promise<GetDownloadSignedUrlDTO> {
        try {

            const getDownloadSignedUrlQuery = this.api.kernel.sourceData.getDownloadSignedUrl.useQuery({
                protocol: protocol,
                relativePath: relativePath,
            });

            if (getDownloadSignedUrlQuery.error) {
                return {
                    success: false,
                    data: {
                        message: `An error occurred. TRPC server query failed: ${JSON.stringify(getDownloadSignedUrlQuery.error)}`,
                        operation: "kp#get-download-signed-url",
                    }
                }
            }

            const signedUrl = getDownloadSignedUrlQuery.data;

            if (!signedUrl || signedUrl.length === 0 || typeof signedUrl !== 'string') {
                return {
                    success: false,
                    data: {
                        message: `An error occurred. Signed URL received from TRPC server is null: ${getDownloadSignedUrlQuery.error}`,
                        operation: "kp#get-download-signed-url",
                    }
                }
            }

            return {
                success: true,
                data: {
                    type: "download-signed-url",
                    url: signedUrl
                }
            }
        }

        catch (error: unknown) {
            const err = error as Error;
            return {
                success: false,
                data: {
                    message: `An error occurred. Error: ${err.message}`,
                    operation: "kp#get-download-signed-url",
                }
            }
        }

    }

    async uploadFile(file: File): Promise<UploadFileDTO> {
        try{

            // 1. Craft relative path and get signed URL
            const relativePath = `user-uploads/${path.basename(file.name)}`;

            const signedUrlDTO = await this.getUploadSignedUrl("s3", relativePath);

            if (!signedUrlDTO.success) {
                return {
                    success: false,
                    data: {
                        operation: "kp#upload",
                        message: `Failed to get signed URL for upload: ${signedUrlDTO.data.message}`
                    }
                }
            }

            const signedUrl = signedUrlDTO.data.url;

            // 2. Upload file to signed URL with axios
            const axiosResponse = await axios.put(signedUrl, file);

            if (axiosResponse.status !== 200) {
                return {
                    success: false,
                    data: {
                        operation: "kp#upload",
                        message: `Failed to upload file to signed URL. Status code: ${axiosResponse.status}. Message: ${axiosResponse.statusText}`
                    }
                }
            }

            const remoteFile: RemoteFile = {
                type: "remote",
                provider: "kernel#s3",
                path: relativePath,
            }

            return {
                success: true,
                data: remoteFile
            }

        } catch (error: unknown) {
            const err = error as Error;
            return {
                success: false,
                data: {
                    operation: "kp#upload",
                    message: `An error occurred: ${err.message}`
                }
            }
        }

    }

    async downloadFile(file: RemoteFile, localPath: string): Promise<DownloadFileDTO> {
        try {

            // 1. Get signed URL for download
            const signedUrlDTO = await this.getDownloadSignedUrl("s3", file.path);

            if (!signedUrlDTO.success) {
                return {
                    success: false,
                    data: {
                        operation: "kp#download",
                        message: `Failed to get signed URL for download: ${signedUrlDTO.data.message}`
                    }
                }
            }

            const signedUrl = signedUrlDTO.data.url;

            // 2. Fetch file from signed URL
            const response = await fetch (signedUrl);

            if (!response.ok) {
                return {
                    success: false,
                    data: {
                        operation: "kp#download",
                        message: `Failed to download file. Status code: ${response.status}. Message: ${response.statusText}`
                    }
                }
            }

            // 3. Create a blob from the response
            const blob = await response.blob();

            // 4. Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = localPath;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


            const localFile: LocalFile ={
                type: "local",
                path: localPath  // NOTE: this is the default download path, user might have changed it
            }

            return {
                success: true,
                data: localFile
            }

        } catch (error: unknown) {
            const err = error as Error;
            return {
                success: false,
                data: {
                    operation: "kp#download",
                    message: `An error occurred: ${err.message}`
                }
            }
        
        }

    }

}