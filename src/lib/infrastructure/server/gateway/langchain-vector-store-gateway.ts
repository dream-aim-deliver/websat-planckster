import { inject, injectable } from 'inversify';
import { Logger } from 'pino';
import { GATEWAYS, UTILS } from '../config/ioc/server-ioc-symbols';
import VectorStoreOutputPort from '~/lib/core/ports/secondary/vector-store-output-port';
import { TCreateVectorStoreDTO, TGetVectorStoreDTO, TDeleteVectorStoreDTO } from '~/lib/core/dto/vector-store-dto';
import { LocalFile, RemoteFile } from '~/lib/core/entity/file';
import type SourceDataGatewayOutputPort from '~/lib/core/ports/secondary/source-data-gateway-output-port';
import * as fs from 'fs';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai"
import { loadDocuments } from '../config/langchain/langchain-utils';
import { TEmbeddings } from '~/lib/core/entity/dadbod/vector-store';
import { Document } from 'langchain/document';
import env from "~/lib/infrastructure/server/config/env";

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
                        name: downloadDTO.data.name,
                        relativePath: downloadDTO.data.relativePath,
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

    async createVectorStore(vectorStoreID: string, files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
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
        const availableFiles = localFilesDTO.status == "partial" ? localFilesDTO.data.successful : localFilesDTO.data;
        const failedFiles = localFilesDTO.status == "partial" ? localFilesDTO.data.failed : [];
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
            openAIApiKey: env.OPENAI_API_KEY,
        });

        const outputEmbeddings: TEmbeddings = {
            id: vectorStoreID,
            provider: "langchain-chroma",
            model: embeddings.model,
            files: []
        }

        const vectorStore = new Chroma(embeddings, {
            collectionName: vectorStoreID,
            url: env.CHROMA_DB_SERVER_URL, // Optional, will default to this value
        });


        for (const [index, file] of availableFiles.entries()) {
            try {
                const initialDocs = await loadDocuments([file.localFile], this.logger);
                const docs: Document[] = []
                initialDocs.forEach((doc, idx) => {
                    const _doc = new Document({
                        pageContent: doc.pageContent,
                        metadata: {
                            source: file.remoteFile.relativePath,
                            provider: file.remoteFile.provider,
                            provider_id: file.remoteFile.id,
                            page: idx + 1,
                        }
                    })
                    docs.push(_doc);
                });

                const ids = docs.map((doc, idx) => `${file.remoteFile.id}-${index}-${idx}`);

                const result = await vectorStore.addDocuments(docs, {
                    ids: ids,
                });
                this.logger.info(`Added file ${file.localFile.name} to vector store. Result: ${JSON.stringify(result)}`);
                outputEmbeddings.files.push({
                    type: "remote",
                    id: `${file.remoteFile.id}-${index}`,
                    provider: `langchain#chroma${vectorStoreID}`,
                    name: file.remoteFile.name,
                    relativePath: file.remoteFile.relativePath,
                    createdAt: new Date().toISOString(),
                });

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
            } finally {
                this.logger.info(`Deleting file locally: ${file.localFile.relativePath}`);
                await this._deleteFilesLocally([file.localFile]);
            }

        }
        return {
            success: true,
            data: {
                provider: "langchain",
                id: "langchain-vector-store",
                embeddings: [outputEmbeddings],
                unsupportedFiles: failedFiles.map(file => file.file),
            }
        }
    }

    async addFilesToVectorStore(vectorStoreID: string, files: RemoteFile[]): Promise<TCreateVectorStoreDTO> {
        const localFilesDTO = await this._downloadFilesLocally(files);
        if (localFilesDTO.status === "error") {
            return {
                success: false,
                data: {
                    message: localFilesDTO.data.message,
                    operation: localFilesDTO.data.operation,
                }
            };
        }

        const availableFiles = localFilesDTO.status === "partial" ? localFilesDTO.data.successful : localFilesDTO.data;
        const failedFiles = localFilesDTO.status === "partial" ? localFilesDTO.data.failed : [];
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
            openAIApiKey: env.OPENAI_API_KEY,
        });

        const vectorStore = new Chroma(embeddings, {
            collectionName: vectorStoreID,
            url: env.CHROMA_DB_SERVER_URL,
        });

        for (const [index, file] of availableFiles.entries()) {
            try {
                const initialDocs = await loadDocuments([file.localFile], this.logger);
                const docs: Document[] = [];
                initialDocs.forEach((doc, idx) => {
                    const _doc = new Document({
                        pageContent: doc.pageContent,
                        metadata: {
                            source: file.remoteFile.relativePath,
                            provider: file.remoteFile.provider,
                            provider_id: file.remoteFile.id,
                            page: idx + 1,
                        }
                    });
                    docs.push(_doc);
                });

                const ids = docs.map((doc, idx) => `${file.remoteFile.id}-${index}-${idx}`);
                const result = await vectorStore.addDocuments(docs, { ids });
                this.logger.info(`Added file ${file.localFile.name} to vector store. Result: ${JSON.stringify(result)}`);
            } catch (error) {
                this.logger.error(`Failed to add file ${file.localFile.name}: ${(error as Error).message}`);
                failedFiles.push({
                    file: file.remoteFile,
                    error: {
                        message: (error as Error).message,
                        operation: "langchain-vector-store#add",
                    }
                });
                continue;
            } finally {
                this.logger.info(`Deleting file locally: ${file.localFile.relativePath}`);
                await this._deleteFilesLocally([file.localFile]);
            }
        }

        return {
            success: true,
            data: {
                provider: "langchain",
                id: vectorStoreID,
                unsupportedFiles: failedFiles.map(file => file.file),
            }
        };
    }
    async getVectorStore(vectorStoreID: string): Promise<TGetVectorStoreDTO> {
        try {
            const vectorStore = new Chroma(new OpenAIEmbeddings(), {
                collectionName: vectorStoreID,
                url: env.CHROMA_DB_SERVER_URL,
            });

            const collection = vectorStore.collection;
            if (!collection) {
                this.logger.error(`Vector store ${vectorStoreID} not found`);
                return {
                    success: false,
                    data: {
                        message: `Vector store ${vectorStoreID} not found`,
                        operation: "langchain-vector-store#get",
                    }
                };
            }
            const response = await collection.get();
            if (!response) {
                this.logger.error(`Failed to retrieve documents in ${vectorStoreID}`);
                return {
                    success: false,
                    data: {
                        message: `No documents found in vector store ${vectorStoreID}`,
                        operation: "langchain-vector-store#get",
                    }
                };
            }
            const documents = response.documents
            if(!documents || documents.length === 0) {
                this.logger.error(`No documents found in vector store ${vectorStoreID}`);
                return {
                    success: false,
                    data: {
                        message: `No documents found in vector store ${vectorStoreID}`,
                        operation: "langchain-vector-store#get",
                    }
                };
            }
            // const files: RemoteFile[] = documents.map((doc) => {
            //     if (!doc || !doc.metadata) {
            //         this.logger.error(`Document ${doc?.pageContent || "unknown"} has no metadata`);
            //         return null;
            //     }
            //     return {
            //         type: "remote",
            //         id: doc.metadata.provider_id,
            //         provider: doc.metadata.provider,
            //         name: doc.metadata.source,
            //         relativePath: doc.metadata.source,
            //         createdAt: new Date().toISOString(),
            //     };
            // }).filter((file): file is RemoteFile => file !== null);

            this.logger.info(`Retrieved vector store ${vectorStoreID} with ${documents.length} documents.`);
            return {
                success: true,
                data: {
                    status: "created", // or another appropriate status
                    provider: "langchain",
                    id: vectorStoreID,
                }
            };
        } catch (error) {
            this.logger.error(`Failed to retrieve vector store ${vectorStoreID}: ${(error as Error).message}`);
            return {
                success: false,
                data: {
                    message: (error as Error).message,
                    operation: "langchain-vector-store#get",
                }
            };
        }
    }
    async deleteVectorStore(vectorStoreID: string): Promise<TDeleteVectorStoreDTO> {
        const vectorStore = new Chroma(new OpenAIEmbeddings(), {
            collectionName: vectorStoreID,
            url: env.CHROMA_DB_SERVER_URL,
        });
        await vectorStore.collection?.delete();
        this.logger.info(`Deleted vector store ${vectorStoreID}`);
        return {
            success: true,
            data: {
                message: `Vector store ${vectorStoreID} deleted`,
                operation: "langchain-vector-store#delete",
            }
        }
    }


}