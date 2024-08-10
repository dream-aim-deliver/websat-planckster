import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { OpenAIClientComponent } from "./client";
import type OpenAIRemoteStorageElement from "~/lib/infrastructure/server/repository/openai-remote-storage-element";
import { OPENAI, UTILS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import fs from "fs";
import { LocalFile } from "~/lib/core/entity/file";
import { Logger } from "pino";

export default async function OpenAIServerComponent() {
    const OpenAIRSE  = serverContainer.get<OpenAIRemoteStorageElement>(OPENAI.OPENAI_REMOTE_STORAGE_ELEMENT);
    const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
    const logger = loggerFactory("OpenAIServerComponent");
    const file: LocalFile = {
        type: "local",
        path: "hello.txt",
        name: "hello.txt"
    }
    fs.writeFileSync(file.path, "Hello, World!");

    const dto = await OpenAIRSE.downloadFile({
        type: "remote",
        provider: "openai",
        path: "file-jMpOuxGJXgqddGKDaWnhlW3t",
        name: "hello.txt"
    });
    logger.info({ dto }, `Uploaded file ${file.path} to OpenAI.`);
    return (
        <div>
            <h1>OpenAI Server Component</h1>
            
            <p>File uploaded to OpenAI</p>
            <OpenAIClientComponent />
        </div>
    )
}