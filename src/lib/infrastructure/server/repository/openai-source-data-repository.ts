import { inject, injectable } from "inversify";
import { GetSourceDataDTO, ListSourceDataDTO, DeleteSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import { GATEWAYS, OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import { File, LocalFile } from "~/lib/core/entity/file";
import { Logger } from "pino";
import { RemoteFile } from "~/lib/core/entity/file";
import { generateOpenAIFilename } from "../config/openai/openai-utils";
import fs from "fs";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
@injectable()
export default class OpenAISourceDataRepository implements SourceDataGatewayOutputPort {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
        @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,

    ) {
        this.logger = loggerFactory("OpenAISourceDataRepository");
    }
    async listForResearchContext(researchContextID: string): Promise<ListSourceDataDTO> {
        this.logger.error("Method not implemented. Tried accessing an unimplemented method 'listForResearchContext' in OpenAISourceDataRepository.")
        return {
            success: false,
            data: {
                operation: "openai#listForResearchContext",
                message: "Method not implemented."
            }
        }
    }
    async list(): Promise<ListSourceDataDTO> {
        this.logger.error("Method not implemented. Tried accessing an unimplemented method 'list' in OpenAISourceDataRepository.")
        return {
            success: false,
            data: {
                operation: "openai#list",
                message: "Method not implemented."
            }
        }
    }

    async get(fileID: string): Promise<GetSourceDataDTO> {
        this.logger.error("Method not implemented. Tried accessing an unimplemented method 'get' in OpenAISourceDataRepository.")
        return {
            success: false,
            data: {
                operation: "openai#get",
                message: "Method not implemented."
            }
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
        this.logger.error("Method not implemented. Tried accessing an unimplemented method 'delete' in OpenAISourceDataRepository.")
        return {
            success: false,
            data: {
                operation: "openai#delete",
                message: "Method not implemented."
            }
        }
    }

    // /**
    //  * The files uploaded by the user to OpenAI are stored in the format {client_id}_{filepath}_{filename}.
    //  * 
    //  * @param id 
    //  * @returns 
    //  */
    // async get(file: File): Promise<GetSourceDataDTO> {
    //     return {
    //         success: false,
    //         data: {
    //             operation: "openai#getFile",
    //             message: "Method not implemented."
    //         }
    //     }
    //     // try {
    //     //     // Convert the core file to the OpenAI file name
    //     //     this.logger.debug(`Retrieving source data with id ${id}.`);
    //     //     const sourceData = await this.openai.files.retrieve(id);
    //     //     this.logger.debug({sourceData}, `Retrieved source data with id ${id}.`);
    //     //     const dto: GetSourceDataDTO = {
    //     //         success: true,
    //     //         data: {
    //     //             provider: "openai",
    //     //             type: "remote",
    //     //             path: sourceData.id,
    //     //             name: sourceData.filename,
    //     //         }
    //     //     }
    //     //     return dto;
    //     // } catch (error) {
    //     //     this.logger.error({ error }, `Failed to retrieve source data with id ${id}.`);
    //     //     const errorDTO: GetSourceDataDTO = {
    //     //         success: false,
    //     //         data: {
    //     //             operation: "openai#files#retrieve",
    //     //             message: `Failed to retrieve source data with id ${id}.`
    //     //         }
    //     //     }
    //     //     return errorDTO;
    //     // }
    // }

    // async list(): Promise<ListSourceDataDTO> {
    //     try {
    //         const files = await this.openai.files.list();
    //         const sourceDataList: RemoteFile[] = files.data.map((sourceData) => {
    //             return {
    //                 provider: "openai",
    //                 type: "remote",
    //                 path: sourceData.id,
    //                 name: sourceData.filename,
    //             }
    //         });
    //         const dto: ListSourceDataDTO = {
    //             success: true,
    //             data: sourceDataList
    //         }
    //         return dto;
    //     } catch (error) {
    //         this.logger.error({ error }, `Failed to list source data.`);
    //         const errorDTO: ListSourceDataDTO = {
    //             success: false,
    //             data: {
    //                 operation: "openai#files#list",
    //                 message: `Failed to list source data.`
    //             }
    //         }
    //         return errorDTO;
    //     }
    // }
    // async delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
    //     return {
    //         success: false,
    //         data: {
    //             operation: "openai#files#del",
    //             message: "Method not implemented."
    //         }
    //     }
    //     // Get the file from openai
    //     // const fileDTO = await this.get(id)
    //     // if (!fileDTO.success) {
    //     //     this.logger.error(`Failed to get source data with id ${id}. File may not exist.`);
    //     //     const dto: DeleteSourceDataDTO = {
    //     //         success: true,
    //     //         data: {
    //     //             type: "remote",
    //     //             provider: "openai",
    //     //             path: id,
    //     //             name: id,
    //     //         }
    //     //     }
    //     //     return dto;
    //     // }

    //     // try {
    //     //     const res = await this.openai.files.del(id);
    //     //     if (!res.deleted) {
    //     //         this.logger.error(`Failed to delete source data with id ${id}.`);
    //     //         const errorDTO: DeleteSourceDataDTO = {
    //     //             success: false,
    //     //             data: {
    //     //                 operation: "openai#files#del",
    //     //                 message: `Failed to delete source data with id ${id}.`
    //     //             }
    //     //         }
    //     //         return errorDTO;
    //     //     }
    //     //     const dto: DeleteSourceDataDTO = {
    //     //         success: true,
    //     //         data: {
    //     //             provider: "openai",
    //     //             type: "remote",
    //     //             path: id,
    //     //             name: fileDTO.data.name,
    //     //         }
    //     //     }
    //     //     return dto;
    //     // } catch (error) {
    //     //     this.logger.error({ error }, `Exception occured while trying to delete source data with id ${id}.`);
    //     //     const errorDTO: DeleteSourceDataDTO = {
    //     //         success: false,
    //     //         data: {
    //     //             operation: "openai#files#del",
    //     //             message: `Failed to delete source data with id ${id}.`
    //     //         }
    //     //     }
    //     //     return errorDTO;
    //     // }
    // }
}