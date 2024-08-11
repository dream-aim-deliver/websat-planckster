import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { OpenAIClientComponent } from "./client";
import { OPENAI, UTILS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type {  File } from "~/lib/core/entity/file";
import type { Logger } from "pino";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import fs from "fs";
import type RemoteStorageElementOutputPort from "~/lib/core/ports/secondary/remote-storage-element-output-port";

const uploadFile = async (file: File) => {
    // const OpenAIRSE = serverContainer.get<RemoteStorageElementOutputPort>(OPENAI.OPENAI_REMOTE_STORAGE_ELEMENT);
    // const data = {
    //     "temperature": 0.5,
    //     "max_tokens": 1,
    //     "top_p": 1,
    //     "frequency_penalty": 0,
    // }
    // fs.writeFileSync("openai-files.json", JSON.stringify(data, null, 2));
    // const localFile: File = {
    //     type: "local",
    //     path: "openai-files.json",
    //     name: "openai-files.json"
    // }

    // await OpenAIRSE.uploadFile(localFile)
}
export default async function OpenAIServerComponent() {
    const OpenAISourceDataRepository = serverContainer.get<SourceDataGatewayOutputPort>(OPENAI.OPENAI_SOURCE_DATA_REPOSITORY);
    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("OpenAIServerComponent");
    // const listSourceDataDTO = await OpenAISourceDataRepository.list();
    const files: File[] = []
    // if(listSourceDataDTO.success) {
    //     files = listSourceDataDTO.data;
    // } else {
    //     logger.error({listSourceDataDTO}, "Failed to list source data.");
    // }
    // const dto = await OpenAISourceDataRepository.get()
    return (
        <div>
            <h1>OpenAI Server Component</h1>
            {/* <p>{JSON.stringify(dto)}</p> */}
            {/* <OpenAIClientComponent files={files}/> */}
        </div>
    )
}