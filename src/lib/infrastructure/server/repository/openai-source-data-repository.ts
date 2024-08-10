import { inject, injectable } from "inversify";
import { GetSourceDataDTO, ListSourceDataDTO, DeleteSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";
import SourceDataRepositoryOutputPort from "~/lib/core/ports/secondary/source-data-repository-output-port";
import { OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import { Logger } from "pino";
import { RemoteFile } from "~/lib/core/entity/file";

@injectable()
export default class OpenAISourceDataRepository implements SourceDataRepositoryOutputPort<string> {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger

    ) {
        this.logger = loggerFactory("OpenAISourceDataRepository");
    }
    async get(id: string): Promise<GetSourceDataDTO> {
        try {
            const sourceData = await this.openai.files.retrieve(id);
            const dto: GetSourceDataDTO = {
                success: true,
                data: {
                    provider: "openai",
                    type: "remote",
                    path: sourceData.id,
                    name: sourceData.filename,
                }
            }
            return dto;
        } catch (error) {
            this.logger.error({ error }, `Failed to retrieve source data with id ${id}.`);
            const errorDTO: GetSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#files#retrieve",
                    message: `Failed to retrieve source data with id ${id}.`
                }
            }
            return errorDTO;
        }
    }

    async list(): Promise<ListSourceDataDTO> {
        try {
            const files = await this.openai.files.list();
            const sourceDataList: RemoteFile[] = files.data.map((sourceData) => {
                return {
                    provider: "openai",
                    type: "remote",
                    path: sourceData.id,
                    name: sourceData.filename,
                }
            });
            const dto: ListSourceDataDTO = {
                success: true,
                data: sourceDataList
            }
            return dto;
        } catch (error) {
            this.logger.error({ error }, `Failed to list source data.`);
            const errorDTO: ListSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#files#list",
                    message: `Failed to list source data.`
                }
            }
            return errorDTO;
        }
    }
    async delete(id: string): Promise<DeleteSourceDataDTO> {
        // Get the file from openai
        const fileDTO = await this.get(id)
        if (!fileDTO.success) {
            this.logger.error(`Failed to get source data with id ${id}. File may not exist.`);
            const dto: DeleteSourceDataDTO = {
                success: true,
                data: {
                    type: "remote",
                    provider: "openai",
                    path: id,
                    name: id,
                }
            }
            return dto;
        }

        try {
            const res = await this.openai.files.del(id);
            if (!res.deleted) {
                this.logger.error(`Failed to delete source data with id ${id}.`);
                const errorDTO: DeleteSourceDataDTO = {
                    success: false,
                    data: {
                        operation: "openai#files#del",
                        message: `Failed to delete source data with id ${id}.`
                    }
                }
                return errorDTO;
            }
            const dto: DeleteSourceDataDTO = {
                success: true,
                data: {
                    provider: "openai",
                    type: "remote",
                    path: id,
                    name: fileDTO.data.name,
                }
            }
            return dto;
        } catch (error) {
            this.logger.error({ error }, `Exception occured while trying to delete source data with id ${id}.`);
            const errorDTO: DeleteSourceDataDTO = {
                success: false,
                data: {
                    operation: "openai#files#del",
                    message: `Failed to delete source data with id ${id}.`
                }
            }
            return errorDTO;
        }
    }
}