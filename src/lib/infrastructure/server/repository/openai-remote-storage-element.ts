import { inject, injectable } from "inversify";
import type { UploadFileDTO, DownloadFileDTO } from "~/lib/core/dto/remote-storage-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import { OPENAI } from "../config/ioc/server-ioc-symbols";
import OpenAI from "openai";
import RemoteStorageElementOutputPort from "~/lib/core/ports/secondary/remote-storage-element-output-port";
import fs from "fs";
@injectable()
export default class OpenAIFileRepository implements RemoteStorageElementOutputPort {
    constructor(
        @inject(OPENAI.OPENAI_CLIENT) private openai: OpenAI
    ) {
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

        const openAIFile = await this.openai.files.create({
            file: fileStream,
            purpose: "assistants"
        });

        const remoteFile: RemoteFile = {
            type: "remote",
            path: openAIFile.id,
            provider: "openai"
        }

        const successDTO: UploadFileDTO = {
            success: true,
            data: remoteFile
        }
        return Promise.resolve(successDTO);

    }

    async downloadFile(file: RemoteFile): Promise<DownloadFileDTO> {
        const openAIFileID = file.path;
        // check if file exists at the path
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

        return {
            success: false,
            data: {
                operation: "download",
                message: "Not implemented."
            }
        }

    }
}