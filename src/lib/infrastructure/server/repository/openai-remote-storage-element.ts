import { inject, injectable } from "inversify";
import type { UploadFileDTO, DownloadFileDTO } from "~/lib/core/dto/remote-storage-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import { OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import RemoteStorageElementOutputPort from "~/lib/core/ports/secondary/remote-storage-element-output-port";
import fs from "fs";
import { Logger } from "pino";
import serverEnv from "~/lib/infrastructure/server/config/env";
@injectable()
export default class OpenAIRemoteStorageElement implements RemoteStorageElementOutputPort {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger
    ) {
        this.logger = loggerFactory("OpenAIRemoteStorageElement");
    }
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

        const fileStream = fs.createReadStream(file.path);
        this.logger.info(`Uploading file ${file.path} to OpenAI.`);
        try {
            const openAIFile = await this.openai.files.create({
                file: fileStream,
                purpose: "assistants"
            });
            const remoteFile: RemoteFile = {
                type: "remote",
                path: openAIFile.id,
                provider: "openai",
                name: openAIFile.filename
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
            localFileName = openAIFile.filename;

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