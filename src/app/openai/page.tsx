import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { OpenAIClientComponent } from "./client";
import { OPENAI, UTILS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type {  File } from "~/lib/core/entity/file";
import type { Logger } from "pino";
import type SourceDataRepositoryOutputPort from "~/lib/core/ports/secondary/source-data-repository-output-port";

export default async function OpenAIServerComponent() {
    const OpenAISourceDataRepository = serverContainer.get<SourceDataRepositoryOutputPort<string>>(OPENAI.OPENAI_SOURCE_DATA_REPOSITORY);

    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("OpenAIServerComponent");
    const listSourceDataDTO = await OpenAISourceDataRepository.list();
    let files: File[] = []
    if(listSourceDataDTO.success) {
        files = listSourceDataDTO.data;
    } else {
        logger.error({listSourceDataDTO}, "Failed to list source data.");
    }
    
    return (
        <div>
            <h1>OpenAI Server Component</h1>
            <OpenAIClientComponent files={files}/>
        </div>
    )
}