import { inject, injectable } from "inversify";
import { GetSourceDataDTO, ListSourceDataDTO, DeleteSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import { GATEWAYS, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import { LocalFile } from "~/lib/core/entity/file";
import { Logger } from "pino";
import { RemoteFile } from "~/lib/core/entity/file";
import { generateSystemFilename, generateOpenAIFilename } from "../config/openai/openai-utils";
import fs from "fs";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
@injectable()
export default class OpenAISourceDataGateway implements SourceDataGatewayOutputPort {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
        @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,

    ) {
        this.logger = loggerFactory("OpenAISourceDataRepository");
    }
    async listSourceDataForResearchContext(researchContextID: number): Promise<ListSourceDataDTO> {
        this.logger.error("Use Kernel Source Data Repository!!! Tried accessing an unimplemented method 'listForResearchContext' in OpenAISourceDataRepository.")
        return {
            success: false,
            data: {
                operation: "openai#listForResearchContext",
                message: "Method not implemented. Use Kernel Source Data Repository."
            }
        }

    }

    async listSourceDataForClient(): Promise<ListSourceDataDTO> {
        const kpCredentialsDTO = await this.authGateway.extractKPCredentials();
        if (!kpCredentialsDTO.success) {
            this.logger.error({ kpCredentialsDTO }, `Failed to get KP credentials. This is required to list files in OpenAI.`);
            return {
                success: false,
                data: {
                    operation: "openai#list",
                    message: "Failed to get KP credentials",
                }
            };
        }
        let files
        try {
            files = await this.openai.files.list();
        } catch (error) {
            this.logger.error({ error }, `Failed to list source data from OpenAI.`);
            return {
                success: false,
                data: {
                    operation: "openai#list",
                    message: `Failed to list source data.`
                }
            }
        }
        // Convert the OpenAI files to RemoteFile objects
        const sourceDataList: RemoteFile[] = files.data.map((sourceData) => {
            return {
                provider: "openai",
                type: "remote",
                id: sourceData.id,
                name: sourceData.filename,
                relativePath: sourceData.filename,
                createdAt: sourceData.created_at.toString(), // TODO: convert to ISO string
            }
        });
        let pageCount = 1;
        try {
            while (files.hasNextPage()) {
                pageCount++;
                this.logger.info(`Fetching next page of files from OpenAI. Page ${pageCount}.`);
                const page = await files.getNextPage()
                this.logger.info(`Fetched page ${pageCount} of files from OpenAI.`);
                const pageSourceDataList: RemoteFile[] = page.data.map((sourceData) => {
                    return {
                        provider: "openai",
                        type: "remote",
                        id: sourceData.id,
                        name: sourceData.filename,
                        relativePath: sourceData.filename,
                        createdAt: sourceData.created_at.toString(), // TODO: convert to ISO string
                    }
                })
                sourceDataList.push(...pageSourceDataList)
            }
        } catch (error) {
            this.logger.error({ error }, `Failed to list source data from OpenAI.`);
            return {
                success: false,
                data: {
                    operation: "openai#list",
                    message: `Failed to list source data.`
                }
            }
        }
        const dto: ListSourceDataDTO = {
            success: true,
            data: sourceDataList
        }
        return dto;

    }

    async get(fileID: string): Promise<GetSourceDataDTO> {
        try {
            const openAIFile = await this.openai.files.retrieve(fileID);
            const localFileName = generateSystemFilename(openAIFile.filename);
            const remoteFile: RemoteFile = {
                provider: "openai",
                type: "remote",
                id: fileID,
                name: openAIFile.filename,
                relativePath: localFileName.name,
                createdAt: openAIFile.created_at.toString(), // TODO: convert to ISO string
            }
            const successDTO: GetSourceDataDTO = {
                success: true,
                data: remoteFile
            }
            return successDTO;
        } catch (error) {
            this.logger.error({ error }, `Failed to download file ${fileID} from OpenAI.`);
            const errorDTO: GetSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#file-download",
                    message: `Failed to download file ${fileID} from OpenAI. ${(error as Error).message}`
                }
            }
            return errorDTO;
        }
    }

    async upload(file: LocalFile, relativePath: string): Promise<GetSourceDataDTO> {
        this.logger.error("Method not implemented. Tried accessing an unimplemented method 'upload' in OpenAISourceDataRepository.")
        // check if file exists at the path
        if (!fs.existsSync(file.relativePath)) {
            const errorDTO: GetSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#file-upload",
                    message: "File not found on the local filesystem. Nothing to upload."
                }
            }
            return errorDTO;
        }

        // Get client ID of the current user
        const clientIDDTO = await this.authGateway.extractKPCredentials();
        if (!clientIDDTO.success) {
            this.logger.error({ clientIDDTO }, `Failed to get KP client ID. This is required to create a unique identified in OpenAI for the user data.`);
            const errorDTO: GetSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#file-upload",
                    message: clientIDDTO.data.message
                }
            }
            return errorDTO;
        }
        const clientID = clientIDDTO.data.clientID;

        const openAIFilename = generateOpenAIFilename(clientID.toString(), file);

        // copy file to `scratch` directory
        const localPath = `${process.env.SCRATCH_DIR}/${openAIFilename}`;
        try {
            this.logger.info(`Copying file ${file.relativePath} to ${localPath}.`);
            fs.copyFileSync(file.relativePath, localPath);
        } catch (error) {
            this.logger.error({ error }, `Failed to copy file ${file.relativePath} to ${localPath}.`);
            const errorDTO: GetSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#file-upload",
                    message: `Failed to copy file ${file.relativePath} to ${localPath}.`
                }
            }
            return errorDTO;
        }

        const fileStream = fs.createReadStream(file.relativePath);
        this.logger.info(`Uploading file ${file.relativePath} as ${openAIFilename} to OpenAI.`);

        try {
            const openAIFile = await this.openai.files.create({
                file: fileStream,
                purpose: "assistants",
            });
            const remoteFile: RemoteFile = {
                provider: "openai",
                type: "remote",
                id: openAIFile.id,
                name: file.name,
                relativePath: openAIFilename,
                createdAt: new Date().toISOString(),
            }

            const successDTO: GetSourceDataDTO = {
                success: true,
                data: remoteFile
            }
            return successDTO;
        } catch (error) {
            this.logger.error({ error }, `Failed to upload file ${file.relativePath} as ${openAIFilename} to OpenAI.`);
            const errorDTO: GetSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#file-upload",
                    message: `Failed to upload file ${file.relativePath} as ${openAIFilename} to OpenAI.`
                }
            }
            return errorDTO;
        }

    }

    async download(file: RemoteFile, localPath?: string): Promise<GetSourceDataDTO> {
        this.logger.error("Method not implemented. Tried accessing an unimplemented method 'download' in OpenAISourceDataRepository.")
        return {
            success: false,
            data: {
                operation: "openai#download",
                message: "Method not implemented."
            }
        }
    }

    async delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
        if(file.provider !== "openai") {
            this.logger.error(`Cannot delete file from provider ${file.provider}. Only files from OpenAI can be deleted.`);
            return {
                success: false,
                data: {
                    operation: "openai#delete",
                    message: `Cannot delete file from provider ${file.provider}. Only files from OpenAI can be deleted.`
                }
            }
        }

        try {
            const deletionDTO = await this.openai.files.del(file.id)
            if (!deletionDTO.deleted) {
                this.logger.error(`Failed to delete file ${file.id} from OpenAI.`);
                return {
                    success: false,
                    data: {
                        operation: "openai#delete",
                        message: `Failed to delete file ${file.id} from OpenAI.`
                    }
                }
            }
            return {
                success: true,
                data: {}
            }
        } catch (error) {
            this.logger.error({ error }, `Failed to delete file ${file.id} from OpenAI.`);
            return {
                success: false,
                data: {
                    operation: "openai#delete",
                    message: `Failed to delete file ${file.id} from OpenAI.`
                }
            }
        }


    }
}