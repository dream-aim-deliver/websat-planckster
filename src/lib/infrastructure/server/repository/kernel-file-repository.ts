import type { UploadFileDTO, DownloadFileDTO } from "~/lib/core/dto/remote-storage-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type FileRepositoryOutputPort from "~/lib/core/ports/secondary/file-repository-output-port";
import type { TBaseErrorDTOData } from "~/sdk/core/dto";

import axios from "axios";
import fs from "fs";
import { inject, injectable } from "inversify";
import type { TKernelSDK } from "../config/kernel/kernel-sdk";
import { GATEWAYS, KERNEL } from "../config/ioc/server-ioc-symbols";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { type ApiError, GetClientDataForUploadViewModel } from "@maany_shr/kernel-planckster-sdk-ts";


@injectable()
export default class KernelFileRepository implements FileRepositoryOutputPort {
    constructor(
        @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
        @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
    ) {
    }

    async uploadFile(file: LocalFile, remotePath: string): Promise<UploadFileDTO> {
        // check if local file exists
        if (!fs.existsSync(file.path)) {
            return {
                success: false,
                data: {
                    operation: "kp#upload",
                    message: `File ${file.path} does not exist on the local filesystem`
                } as TBaseErrorDTOData
            }
        }

        // Get KP Credentials from Auth Gateway
        const kpCredentialsDTO = await this.authGateway.extractKPCredentials();
        if (!kpCredentialsDTO.success) {
            return {
                success: false,
                data: {
                    operation: "kp#upload",
                    message: kpCredentialsDTO.data.message
                } as TBaseErrorDTOData
            }
        }
        const { clientID, xAuthToken } = kpCredentialsDTO.data;

        let signedUrlDTO: GetClientDataForUploadViewModel | undefined = undefined;
        try {
            // Get signed URL from kernel
            signedUrlDTO = await this.kernelSDK.getClientDataForUpload({
                id: clientID,
                protocol: "s3",
                relativePath: remotePath,
                xAuthToken: xAuthToken,
            });
        } catch (error: unknown) {
            const err = error as ApiError
            return {
                success: false,
                data: {
                    operation: "kp#upload",
                    message: `Error getting signed URL from Kernel. Status Code: ${err.status} ${err.statusText}. Message: ${err.message}`,
                } as TBaseErrorDTOData
            }
        }

        if (!signedUrlDTO.status) {
            return {
                success: false,
                data: {
                    operation: "kp#upload",
                    message: `Error getting signed URL from Kernel. Message: ${JSON.stringify(signedUrlDTO)}`,
                } as TBaseErrorDTOData
            }
        }

        // Upload file to signed URL using axios
        try {
            const signedUrl = signedUrlDTO.signed_url;
            const fileData = fs.readFileSync(file.path);
            const response = await axios.put(signedUrl, fileData);
            if (response.status !== 200) {
                return {
                    success: false,
                    data: {
                        operation: "kp#upload",
                        message: `Error uploading file to signed URL. Status Code: ${response.status} ${response.statusText}`,
                    } as TBaseErrorDTOData
                }
            }
            const remoteFile: RemoteFile = {
                type: "remote",
                provider: "kernel#s3",
                path: remotePath,
            }

            return {
                success: true,
                data: remoteFile
            }
        } catch (error: unknown) {
            const err = error as Error
            return {
                success: false,
                data: {
                    operation: "kp#upload",
                    message: `Error uploading file to signed URL. ${err.message}`,
                } as TBaseErrorDTOData
            }
        }

    }

    async downloadFile(file: RemoteFile): Promise<DownloadFileDTO> {
        throw new Error("Method not implemented.");
    }
}