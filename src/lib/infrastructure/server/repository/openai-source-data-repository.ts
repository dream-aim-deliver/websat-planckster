import { inject, injectable } from "inversify";
import { GetSourceDataDTO, ListSourceDataDTO, DeleteSourceDataDTO } from "~/lib/core/dto/source-data-repository-dto";
import SourceDataRepositoryOutputPort from "~/lib/core/ports/secondary/source-data-repository-output-port";
import { OPENAI, UTILS } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import { Logger } from "pino";

@injectable()
export default class OpenAISourceDataRepository implements SourceDataRepositoryOutputPort {
    private logger: Logger;
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger

    ) {
        this.logger = loggerFactory("OpenAISourceDataRepository");
    }
    async get(id: string): Promise<GetSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    async list(): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<DeleteSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
}