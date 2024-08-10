import { inject, injectable } from "inversify";
import type { UploadFileDTO, DownloadFileDTO } from "~/lib/core/dto/remote-storage-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import { GATEWAYS, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import RemoteStorageElementOutputPort from "~/lib/core/ports/secondary/remote-storage-element-output-port";
import fs from "fs";
import { Logger } from "pino";
import serverEnv from "~/lib/infrastructure/server/config/env";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { generateLocalFilename, generateOpenAIFilename } from "../config/openai/openai-utils";
@injectable()
export default class OpenAIRemoteStorageElement implements RemoteStorageElementOutputPort {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger
    ) {
        this.logger = loggerFactory("OpenAIRemoteStorageElement");
    }
    

    /**
     * Saves a local file as {clientID}_{file_path}_{file_name} to OpenAI.
     * The file is copied to the scratch directory before uploading.
     * The file is uploaded to OpenAI with the purpose "assistants".
     * @param file A local file object with path to the file on the local disk.
     * @returns A DTO with the success status and the remote file object if successful.
     * The remote file object has the provider as "openai", and the path as the OpenAI file ID.
     */
    async uploadFile(file: LocalFile): Promise<UploadFileDTO> {

        // check if file exists at the path
        if (!fs.existsSync(file.path)) {
            const errorDTO: UploadFileDTO = {
                success: false,
                data: {
                    operation: "upload",
                    message: "File not found."
                }
            }
            return Promise.resolve(errorDTO);
        }

        // Get client ID of the current user
        const clientIDDTO = await this.authGateway.extractKPCredentials();
        if(!clientIDDTO.success) {
            console.log({clientIDDTO} , `Failed to get KP client ID. This is required to create a unique identified in OpenAI for the user data.`);
            const errorDTO: UploadFileDTO = {
                success: false,
                data: {
                    operation: "upload",
                    message: clientIDDTO.data.message
                }
            }
            return Promise.resolve(errorDTO);
        }
        const clientID = clientIDDTO.data.clientID;

        const openAIFilename = generateOpenAIFilename(clientID.toString(), file);

        // Copy file to `scratch` directory
        const localPath = `${serverEnv.SCRATCH_DIR}/${openAIFilename}`;
        try {
        this.logger.info(`Copying file ${file.path} to ${localPath}.`);
        fs.copyFileSync(file.path, localPath);
        } catch (error) {
            this.logger.error({ error }, `Failed to copy file ${file.path} to ${localPath}.`);
            const errorDTO: UploadFileDTO = {
                success: false,
                data: {
                    operation: "upload",
                    message: `Failed to copy file ${file.path} to ${localPath}.`
                }
            }
            return Promise.resolve(errorDTO);
        }


        const fileStream = fs.createReadStream(localPath);
        this.logger.info(`Uploading file ${file.path} as ${localPath} to OpenAI.`);

        try {
            const openAIFile = await this.openai.files.create({
                file: fileStream,
                purpose: "assistants"
            });
            const remoteFile: RemoteFile = {
                type: "remote",
                path: openAIFile.id,
                provider: "openai",
                name: file.name
            }

            const successDTO: UploadFileDTO = {
                success: true,
                data: remoteFile
            }
            return Promise.resolve(successDTO);

        } catch (error) {
            this.logger.error({ error }, `Failed to upload file ${file.path} to OpenAI.`);
            const errorDTO: UploadFileDTO = {
                success: false,
                data: {
                    operation: "upload",
                    message: `Failed to upload file ${file.path} to OpenAI.`
                }
            }
            return Promise.resolve(errorDTO);
        }
    }

    /**
     * Downloads a file from OpenAI and saves it to the local disk at the {SCRATCH_DIRECTORY}/{sanitized_file_name}.
     * The file name is generated from the OpenAI file name to clean up details like client ID.
     * @param file A remote file object with provider as "openai", and path as the OpenAI file ID.
     * @returns 
     */
    async downloadFile(file: RemoteFile): Promise<DownloadFileDTO> {
        const openAIFileID = file.path;
        if (!openAIFileID) {
            const errorDTO: DownloadFileDTO = {
                success: false,
                data: {
                    operation: "download",
                    message: "File not found."
                }
            }
            return Promise.resolve(errorDTO);
        }
        // Get file details from OpenAI
        let localFileName;
        try {
            this.logger.debug(`Getting file details for ${openAIFileID} from OpenAI.`);
            const openAIFile = await this.openai.files.retrieve(openAIFileID);
            const openAIFilename = openAIFile.filename;
            localFileName = generateLocalFilename(openAIFilename).name;

        } catch (error) {
            this.logger.error({ error }, `Failed to get file details for ${openAIFileID} from OpenAI.`);
            const errorDTO: DownloadFileDTO = {
                success: false,
                data: {
                    operation: "download",
                    message: `Failed to get file details for ${openAIFileID} from OpenAI.`
                }
            }
            return Promise.resolve(errorDTO);
        }
        // Try to download the file
        const localPath = `${serverEnv.SCRATCH_DIR}/${localFileName}`;
        let fileContentResponse;
        try {
            this.logger.info(`Downloading file ${openAIFileID} from OpenAI.`);
            const content = await this.openai.files.content(openAIFileID)
            fileContentResponse = content;
        } catch (error) {
            this.logger.error({ error }, `Failed to download file ${openAIFileID} from OpenAI.`);
            const errorDTO: DownloadFileDTO = {
                success: false,
                data: {
                    operation: "download",
                    message: `Failed to download file ${openAIFileID} from OpenAI.`
                }
            }
            return Promise.resolve(errorDTO);
        }

        // Write the file to disk
        try {
            this.logger.info(`Writing file ${openAIFileID} to ${localPath}.`);
            const bufferView = new Uint8Array(await fileContentResponse.arrayBuffer());
            fs.writeFileSync(localPath, bufferView);
            this.logger.info(`Downloaded file ${openAIFileID} from OpenAI to ${localPath}.`);
            return {
                success: false,
                data: {
                    operation: "download",
                    message: "Not implemented."
                }
            }
        } catch (error) {
            this.logger.error({ error }, `Failed to write file ${openAIFileID} to ${localPath}.`);
            const errorDTO: DownloadFileDTO = {
                success: false,
                data: {
                    operation: "download",
                    message: `Failed to write file ${openAIFileID} to ${localPath}.`
                }
            }
            return Promise.resolve(errorDTO);
        }
    }
}