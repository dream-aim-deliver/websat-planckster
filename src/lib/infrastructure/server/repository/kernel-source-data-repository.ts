import { inject, injectable } from "inversify";
import { type ListSourceDataDTO, type GetSourceDataDTO, type UploadSourceDataDTO, type DownloadSourceDataDTO, type DeleteSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import { GATEWAYS, KERNEL, UTILS } from "../config/ioc/server-ioc-symbols";
import { Logger } from "pino";
import type { TKernelSDK } from "../config/kernel/kernel-sdk";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import axios, { Axios } from "axios";
import fs from "fs";
import * as stream from 'stream';
import { promisify } from 'util';
import { TBaseErrorDTOData } from "~/sdk/core/dto";
import { error } from "console";

// TODO: only need list and download methods
@injectable()
export default class KernelSourceDataRepository implements SourceDataGatewayOutputPort {
    private logger: Logger;
    constructor(
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
        @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
        @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
    ) {
        this.logger = loggerFactory("KernelSourceDataRepository");
    }

    async list(): Promise<ListSourceDataDTO> {
        return {
            success: false,
            data: {
                operation: "kernel#source-data#list",
                message: "Method not implemented."
            }
        }
    }
    async listForResearchContext(researchContextID: string): Promise<ListSourceDataDTO> {
        return {
            success: false,
            data: {
                operation: "kernel#lsource-data#listForResearchContext",
                message: "Method not implemented."
            }
        }
    }
    async get(fileID: string): Promise<GetSourceDataDTO> {
        return {
            success: false,
            data: {
                operation: "kernel#source-data#get",
                message: "Method not implemented."
            }
        }
    }
    async upload(file: LocalFile, relativePath: string): Promise<UploadSourceDataDTO> {
        return {
            success: false,
            data: {
                operation: "kernel#source-data#upload",
                message: "Method not implemented."
            }
        }
    }

    /**
     * Downloads a file from kernel to the local scratch space.
     * @param file 
     * @param localPath 
     */
    async download(file: RemoteFile, localPath?: string): Promise<DownloadSourceDataDTO> {
        // check if local scratch dir exists and generate local file path
        const scratchDir = process.env.SCRATCH_DIR || "/tmp";
        const localFilePath = localPath || `${scratchDir}/${file.relativePath}`;
        if (!fs.existsSync(scratchDir)) {
            this.logger.error(`Scratch directory ${scratchDir} does not exist.`)
            return {
                success: false,
                data: {
                    operation: "kernel#source-data#download",
                    message: `Scratch directory ${scratchDir} does not exist.`
                }
            }
        }

        const kernelCredentialsDTO = await this.authGateway.extractKPCredentials();
        if (!kernelCredentialsDTO.success) {
            this.logger.error(kernelCredentialsDTO, `Failed to extract KP credentials from the session.`)
            return {
                success: false,
                data: {
                    operation: "kernel#source-data#download",
                    message: kernelCredentialsDTO.data.message
                }
            }
        }

        this.logger.debug(`Downloading file ${file.relativePath} from kernel.`);
        if (file.provider !== "kernel#s3") {
            this.logger.error(`Invalid provider ${file.provider}. Expected kernel#s3.`)
            return {
                success: false,
                data: {
                    operation: "kernel#source-data#download",
                    message: `Invalid provider ${file.provider}. Expected kernel#s3.`
                }
            }
        }

        let fileID: number;
        try {
            fileID = parseInt(file.id)
        } catch (error) {
            this.logger.error(error, `Failed to parse file ID ${file.id}. File IDs should be integers.`)
            return {
                success: false,
                data: {
                    operation: "kernel#source-data#download",
                    message: `Failed to parse file ID ${file.id}. File IDs should be integers.`
                }
            }
        }

        const clientDataForDownloadDTO = await this.kernelSDK.getClientDataForDownload({
            id: fileID,
            protocol: "s3",
            relativePath: file.relativePath,
            xAuthToken: kernelCredentialsDTO.data.xAuthToken,
        })

        if (!clientDataForDownloadDTO.status) {
            this.logger.error(clientDataForDownloadDTO, `Failed to get client data for download.`)
            return {
                success: false,
                data: {
                    operation: "kernel#source-data#download",
                    message: `Failed to get signed url for download. File ID: ${file.id}. Error: ${clientDataForDownloadDTO.errorMessage}`
                }
            }
        }

        const signedUrl = clientDataForDownloadDTO.signed_url;
        
        const finished = promisify(stream.finished);
        const fileStream = fs.createWriteStream(localFilePath);
        let errorData: TBaseErrorDTOData | undefined;

        const response = await axios.get(signedUrl,{
            responseType: 'stream',
        })
        
        response.data.pipe(fileStream);
        
        try {
            await finished(fileStream)
        } catch (error) {
            this.logger.error(error, `Failed to write file to local path ${localFilePath}.`)
            errorData = {
                operation: "kernel#source-data#download",
                message: `Failed to write file to local path ${localFilePath}.`
            }
        }
        
        if(errorData) {
            return {
                success: false,
                data: errorData
            }
        }
        return {
            success: true,
            data: {
                type: "local",
                relativePath: localFilePath,
                name: file.name,
            }
        }
    }

    
    async delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
        return {
            success: false,
            data: {
                operation: "kernel#source-data#delete",
                message: "Method not implemented."
            }
        }
    }

}