import type { ListSourceDataDTO, GetSourceDataDTO, DeleteSourceDataDTO, DownloadSourceDataDTO, UploadSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import type { Logger, ILogObj } from "tslog";
import { inject, injectable } from "inversify";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import type { TVanillaAPI } from "../trpc/vanilla-api";
import { TBaseErrorDTOData } from "~/sdk/core/dto";
import axios from "axios";
import saveAs from "file-saver";

/**
 * Represents a class that interacts with a remote storage element that is managed by kernel.
 * In the v1 and v2 versions of the kernel, the remote storage element is an S3 bucket.
 * Uploads and Downloads are done using signed URLs.
 */
@injectable()
export default class BrowserSourceDataGateway implements SourceDataGatewayOutputPort {

    private logger: Logger<ILogObj>
    constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>
    ) {
    this.logger = this.loggerFactory("BrowserSourceDataRepository")
    }

    /**
     * Retrieves the signed URL for uploading a file to the remote storage.
     *
     * @param protocol - The protocol to use for the upload.
     * @param relativePath - The relative path of the file.
     * @returns A promise that resolves to an object containing the signed URL and the provider, or an object containing an error message.
     */
    private async __getUploadSignedUrl(protocol: string, relativePath: string): Promise<
    | {
        success: true;
        data: {
        url: string;
        provider: string;
        };
    }
    | {
        success: false;
        data: TBaseErrorDTOData;
    }
    > {
    try {
        const response = await this.api.kernel.sourceData.getUploadSignedUrl.query({
            protocol: protocol,
            relativePath: relativePath,
        });

        if (!response) {
        this.logger.error(`Could not get signed url from the TRPC server to upload file: did not receive a response.`);
        return {
            success: false,
            data: {
            message: `Could not get signed url from the TRPC server to upload file: did not receive a response.`,
            operation: "kp-file-repository#get-upload-signed-url",
            },
        };
        }
        if (!response.success) {
        this.logger.error(`An error occurred while getting signed URL for upload. Error: ${JSON.stringify(response.data, null, 2)}`);
        return {
            success: false,
            data: {
            message: `An error occurred while getting signed URL for upload. Error: ${JSON.stringify(response.data, null, 2)}`,
            operation: "kp#get-upload-signed-url",
            },
        };
        }

        const signedUrl = response.data;

        if (!signedUrl || typeof signedUrl !== "string") {
        this.logger.error(`An error occurred while getting signed URL for upload. Signed URL received from TRPC server is invalid: ${JSON.stringify(response)}`);

        return {
            success: false,
            data: {
            message: `An error occurred. Signed URL received from TRPC server is invalid: ${JSON.stringify(response)}`,
            operation: "kp#get-upload-signed-url",
            },
        };
        }

        return {
        success: true,
        data: {
            url: signedUrl,
            provider: "kernel#s3",
        },
        };
    } catch (error: unknown) {
        const err = error as Error;
        this.logger.error(`An error occurred while getting signed URL for upload. Error: ${err.message}`);
        return {
        success: false,
        data: {
            message: `An error occurred while getting signed URL for upload. Error: ${err.message}`,
            operation: "kp#get-upload-signed-url",
        },
        };
    }
    }


    /**
     * Retrieves a signed URL for downloading a file from the remote storage.
     *
     * @param protocol The protocol to use for the download.
     * @param relativePath The relative path of the file to download.
     * @returns A promise that resolves to the signed URL for downloading the file.
     */
    private async __getDownloadSignedUrl(
        protocol: string,
        relativePath: string,
    ): Promise<
        | {
        success: true;
        data: {
            url: string;
            provider: string;
        };
        }
        | { success: false; data: TBaseErrorDTOData }
    > {
        try {

            const response = await this.api.kernel.sourceData.getDownloadSignedUrl.query({
                protocol: protocol,
                relativePath: relativePath,
            });

            if (!response) {
                this.logger.error(`Could not get signed url from the TRPC server to download file: did not receive a response.`);
                return {
                    success: false,
                    data: {
                        message: `Could not get signed url from the TRPC server to download file: did not receive a response.`,
                        operation: "kp-file-repository#get-download-signed-url",
                    }
                }
            }

            if (!response.success) {
                this.logger.error(`An error occurred while getting signed URL for download. Error: ${JSON.stringify(response.data, null, 2)}`);
                return {
                    success: false,
                    data: {
                        message: `An error occurred. Error: ${JSON.stringify(response.data, null, 2)}`,
                        operation: "kp#get-download-signed-url",
                    }
                }
            }

            const signedUrl = response.data;

            if (!signedUrl || typeof signedUrl !== 'string') {
                this.logger.error(`An error occurred while getting signed URL for download. Signed URL received from TRPC server is invalid: ${JSON.stringify(response)}`);
                return {
                    success: false,
                    data: {
                        message: `An error occurred while getting signed URL for download. Signed URL received from TRPC server is invalid: ${JSON.stringify(response)}`,
                        operation: "kp#get-download-signed-url",
                    }
                }
            }

            return {
                success: true,
                data: {
                    url: signedUrl,
                    provider: "kernel#s3",
                }
            };
        }

        catch (error: unknown) {
            const err = error as Error;
            this.logger.error(`An error occurred while getting signed URL for download. Error: ${err.message}`);
            return {
                success: false,
                data: {
                    message: `An error occurred while getting signed URL for download. Error: ${err.message}`,
                    operation: "kp#get-download-signed-url",
                }
            }
        }
    }

    async download(file: RemoteFile, localPath?: string): Promise<DownloadSourceDataDTO> {

    try {
        // 1. Get signed URL for download
        const signedUrlDTO = await this.__getDownloadSignedUrl("s3", file.relativePath);

        if (!signedUrlDTO.success) {
            this.logger.error(`Failed to get signed URL for download: ${signedUrlDTO.data.message}`);
            return {
            success: false,
            data: {
                operation: `${signedUrlDTO.data.operation}`,
                message: `Failed to get signed URL for download: ${signedUrlDTO.data.message}`,
            },
            };
        }

        const signedUrl = signedUrlDTO.data.url;

        // 2. Fetch file from signed URL
            const response = await axios.get<Blob>(signedUrl, {responseType: "blob"});

            if (response.status !== 200 || !response.data) {
            this.logger.error(`Failed to download file. Status code: ${response.status}. Message: ${response.statusText}`);
            return {
                success: false,
                data: {
                operation: "BrowserSourceDataGateway#download",
                message: `Failed to download file. Status code: ${response.status}. Message: ${response.statusText}`,
                },
            };
            }

        // 3. Save file to local path
        saveAs(response.data, localPath);

        // 4. Return local file object
        const localFile: LocalFile = {
            type: "local",
            relativePath: file.name,
            name: file.name,
        };

        return {
            success: true,
            data: localFile
        };

        } catch (error: unknown) {
        const err = error as Error;
        this.logger.error(`An error occurred while downloading file: ${err.message}`);
        return {
            success: false,
            data: {
            operation: "kp#download",
            message: `An error occurred while downloading file: ${err.message}`,
            },
        };
        }



    }

  /**
   * Uploads a file to the remote storage managed by Kernel.
   *
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to an UploadFileDTO object containing the result of the upload operation.
   */
    async upload(file: LocalFile, relativePath: string): Promise<UploadSourceDataDTO> {
   try {
      // check if LocalFile contains the raw file
      if (!file.raw) {
        return {
          success: false,
          data: {
            operation: "kp#upload",
            message: `LocalFile does not contain the raw file.`,
          },
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const rawFile: File = file.raw;
      const fileName = rawFile.name;
      // 1. Craft relative path and get signed URL
      const relativePath = `user-uploads/${fileName}`;

      const signedUrlDTO = await this.__getUploadSignedUrl("s3", relativePath);

      if (!signedUrlDTO.success) {
        return {
          success: false,
          data: {
            operation: "kp#upload",
            message: `Failed to get signed URL for upload: ${signedUrlDTO.data.message}`,
          },
        };
      }

      const signedUrl = signedUrlDTO.data.url;

      // 2. Upload file to signed URL with axios
      const axiosResponse = await axios.put(signedUrl, rawFile);

      if (axiosResponse.status !== 200) {
        return {
          success: false,
          data: {
            operation: "kp#upload",
            message: `Failed to upload file to signed URL. Status code: ${axiosResponse.status}. Message: ${axiosResponse.statusText}`,
          },
        };
      }

      const remoteFile: RemoteFile = {
        type: "remote",
        provider: "kernel#s3",
        relativePath: relativePath,
        name: fileName,
      };

      return {
        success: true,
        data: remoteFile,
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        data: {
          operation: "kp#upload",
          message: `An error occurred: ${err.message}`,
        },
      };
    }

    }


    async listForResearchContext(clientID: string, researchContextID: string): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }

    async list(clientID: string, researchContextID?: string): Promise<ListSourceDataDTO> {
        throw new Error("Method not implemented.");
    }

    async get(clientID: string, fileID: string): Promise<GetSourceDataDTO> {
        throw new Error("Method not implemented.");
    }

    async delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
        throw new Error("Method not implemented.");
    }
}