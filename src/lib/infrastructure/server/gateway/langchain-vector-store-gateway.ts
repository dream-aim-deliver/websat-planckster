import { Document } from 'langchain/document';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';
import { GATEWAYS, UTILS } from '../config/ioc/server-ioc-symbols';
import VectorStoreOutputPort from '~/lib/core/ports/secondary/vector-store-output-port';
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from '~/lib/core/dto/vector-store-dto';
import { LocalFile, RemoteFile } from '~/lib/core/entity/file';
import type SourceDataGatewayOutputPort from '~/lib/core/ports/secondary/source-data-gateway-output-port';
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PPTLoader } from '../langchain/langchain-pptx-loader';
import * as fs from 'fs';
import { TEmbeddings } from '~/lib/core/entity/dadbod/vector-store';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { loadDocuments } from '../config/langchain/langchain-utils';

@injectable()
export default class LangchainVectorStoreGateway implements VectorStoreOutputPort {
    private logger: Logger;
    constructor(
        @inject(UTILS.LOGGER_FACTORY) loggerFactory: (module: string) => Logger,
        @inject(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY) private KernelSourceDataGateway: SourceDataGatewayOutputPort,
    ) {
        this.logger = loggerFactory("LangchainVectorStoreGateway");
    }

    async _downloadFilesLocally(files: RemoteFile[]): Promise<
        | {
            status: "success",
            data: {
                localFile: LocalFile,
                remoteFile: RemoteFile
            }[]
        }
        | { status: "error", data: { message: string, operation: string } }
        | {
            status: "partial", data: {
                successful: {
                    localFile: LocalFile,
                    remoteFile: RemoteFile
                }[],
                failed: {
                    file: RemoteFile,
                    error: {
                        message: string,
                        operation: string
                    }
                }[]
            }
        }
    > {
        const localFiles: {
            localFile: LocalFile,
            remoteFile: RemoteFile
        }[] = [];

        const failedFiles: {
            file: RemoteFile,
            error: {
                message: string,
                operation: string
            }
        }[] = [];

        for (const file of files) {
            const downloadDTO = await this.KernelSourceDataGateway.download(file);
            if (!downloadDTO.success) {
                failedFiles.push({
                    file: {
                        type: "remote",
                        id: file.id,
                        provider: file.provider,
                        name: file.name,
                        relativePath: file.relativePath,
                        createdAt: file.createdAt,
                    },
                    error: {
                        message: downloadDTO.data.message,
                        operation: "langchain-vector-store#download",
                    }
                });
            } else {
                localFiles.push({
                    localFile: {
                        type: "local",
                        name: file.name,
                        relativePath: file.relativePath,
                    },
                    remoteFile: file
                });
            }
        }

        if (failedFiles.length > 0 && localFiles.length > 0) {
            return {
                status: "partial",
                data: {
                    successful: localFiles,
                    failed: failedFiles,
                }
            }
        }
        if (localFiles.length > 0) {
            return {
                status: "success",
                data: localFiles
            }
        }
        return {
            status: "error",
            data: {
                message: "Failed to download files",
                operation: "langchain-vector-store#download",
            }
        }
    }


    async _deleteFilesLocally(files: LocalFile[]): Promise<void> {
        for (const file of files) {
            try {
                fs.unlinkSync(file.relativePath);
                this.logger.info(`Deleted file ${file.name}`);
            } catch (error) {
                this.logger.error(`Failed to delete file ${file.name}: ${(error as Error).message}`);
            }
        }
    }

    async createVectorStore(name: string, files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
        const localFilesDTO = await this._downloadFilesLocally(files);
        if (localFilesDTO.status == "error") {
            return {
                success: false,
                data: {
                    message: localFilesDTO.data.message,
                    operation: localFilesDTO.data.operation,
                }
            }
        }
        const localFiles = localFilesDTO.status == "partial" ? localFilesDTO.data.successful : localFilesDTO.data;
        const failedFiles = localFilesDTO.status == "partial" ? localFilesDTO.data.failed : [];
        // const embeddings: TEmbeddings = {
        //     id: "langchain-vector-store",
        //     provider: "langchain-chroma",
        //     algorithm: "all-MiniLM-L6-v2",
        //     files: []
        // }
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
        });
        const vectorStore = new Chroma(embeddings, {
            collectionName: "langchain-vector-store",
        });

        for (const file of localFiles) {
            try {
                const documents = await loadDocuments([file.localFile], this.logger);
                for (const document of documents) {
                    document.metadata.source = file.remoteFile.relativePath;
                    document.metadata.provider = file.remoteFile.provider;
                    document.metadata.provider_id = file.remoteFile.id;
                }
                // add files to vector store

                embeddings.files.push(file.remoteFile);
            } catch (error) {
                this.logger.error(`Failed to load file ${file.localFile.name}: ${(error as Error).message}`);
                failedFiles.push({
                    file: file.remoteFile,
                    error: {
                        message: (error as Error).message,
                        operation: "langchain-vector-store#load",
                    }
                });
                continue;
            }
        }
        return {
            success: true,
            data: {
                provider: "langchain",
                id: "langchain-vector-store",
                embeddings: [embeddings],
                unsupportedFiles: failedFiles.map(file => file.file),
            }
        }

    }
    async addFilesToVectorStore(researchContextExternalID: string, files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
        throw new Error('Method not implemented.');
    }
    async getVectorStore(researchContextExternalID: string): Promise<TGetVectorStoreDTO> {
        throw new Error('Method not implemented.');
    }
    async deleteVectorStore(researchContextExternalID: string): Promise<TDeleteVectorStoreDTO> {
        throw new Error('Method not implemented.');
    }


}