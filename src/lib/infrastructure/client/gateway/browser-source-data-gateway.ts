import type { ListSourceDataDTO, GetSourceDataDTO, DeleteSourceDataDTO, DownloadSourceDataDTO, UploadSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type { Logger, ILogObj } from "tslog";
import { inject, injectable } from "inversify";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import type { TVanillaAPI } from "../trpc/vanilla-api";
import axios from "axios";
import saveAs from "file-saver";
import KernelPlancksterSourceDataOutputPort from "../../common/ports/secondary/kernel-planckster-source-data-output-port";
import { GetClientDataForUploadDTO, GetClientDataForDownloadDTO, NewSourceDataDTO } from "../../common/dto/kernel-planckster-source-data-gateway-dto";

/**
 * Represents a class that interacts with a remote storage element that is managed by kernel.
 * In the v1 and v2 versions of the kernel, the remote storage element is an S3 bucket.
 * Uploads and Downloads are done using signed URLs.
 */
@injectable()
export default class BrowserKernelSourceDataGateway implements KernelPlancksterSourceDataOutputPort {
  private logger: Logger<ILogObj>;
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>,
  ) {
    this.logger = this.loggerFactory("BrowserSourceDataRepository");
  }

  async getClientDataForUpload(relativePath: string): Promise<GetClientDataForUploadDTO> {
    try {
      const dto = await this.api.gateways.sourceData.getClientDataForUpload.query({
        relativePath,
      });

      this.logger.debug({ dto }, `Successfully fetched client data for upload for relative path: ${relativePath}`);

      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to get client data for upload");

      return {
        success: false,
        data: {
          operation: "sourceDataRouter#getClientDataForUpload",
          message: "Could not invoke the server side feature to get client data for upload",
        },
      };
    }
  }

  async getClientDataForDownload(relativePath: string): Promise<GetClientDataForDownloadDTO> {
    try {
      const dto = await this.api.gateways.sourceData.getClientDataForDownload.query({
        relativePath,
      });

      this.logger.debug({ dto }, `Successfully fetched client data for download for relative path: ${relativePath}`);

      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to get client data for download");

      return {
        success: false,
        data: {
          operation: "sourceDataRouter#getClientDataForDownload",
          message: "Could not invoke the server side feature to get client data for download",
        },
      };
    }
  }

  async newSourceData(sourceDataName: string, relativePath: string): Promise<NewSourceDataDTO> {
    try {
      const dto = await this.api.gateways.sourceData.newSourceData.mutate({
        sourceDataName,
        relativePath,
      });

      this.logger.debug({ dto }, `Successfully created new source data for relative path: ${relativePath}`);

      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to create new source data");

      return {
        success: false,
        data: {
          operation: "sourceDataRouter#newSourceData",
          message: "Could not invoke the server side feature to create new source data",
        },
      };
    }
  }

  async download(file: RemoteFile, localPath?: string): Promise<DownloadSourceDataDTO> {
    try {
      // 1. Get signed URL for download
      const signedUrlDTO = await this.getClientDataForDownload(file.relativePath);

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

      const signedUrl = signedUrlDTO.data;

      // 2. Fetch file from signed URL
      const response = await axios.get<Blob>(signedUrl, { responseType: "blob" });

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

      // 3. Save file to local path, if any
      saveAs(response.data, localPath);

      // 4. Return local file object
      const localFile: LocalFile = {
        type: "local",
        relativePath: file.name,
        name: file.name,
      };

      return {
        success: true,
        data: localFile,
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
   * Uploads a file to the remote storage managed by Kernel and registers the file as a source data.
   *
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to an UploadSourceDataDTO object containing the result of the upload operation.
   */
  async upload(file: LocalFile, relativePath: string): Promise<UploadSourceDataDTO> {
    try {
      // check if LocalFile contains the raw file
      if (!file.raw) {
        this.logger.error(`LocalFile does not contain the raw file.`);
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

      // 1. Get signed URL
      const signedUrlDTO = await this.getClientDataForUpload(relativePath);

      if (!signedUrlDTO.success) {
        this.logger.error(`Failed to get signed URL for upload: ${signedUrlDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "kp#upload",
            message: `Failed to get signed URL for upload: ${signedUrlDTO.data.message}`,
          },
        };
      }

      const signedUrl = signedUrlDTO.data;

      // 2. Upload file to signed URL with axios
      const axiosResponse = await axios.put(signedUrl, rawFile);

      if (axiosResponse.status !== 200) {
        this.logger.error(`Failed to upload file to signed URL. Status code: ${axiosResponse.status}. Message: ${axiosResponse.statusText}`);
        return {
          success: false,
          data: {
            operation: "kp#upload",
            message: `Failed to upload file to signed URL. Status code: ${axiosResponse.status}. Message: ${axiosResponse.statusText}`,
          },
        };
      }

      // 3. Register the new source data
      const createSourceDataDTO = await this.newSourceData(fileName, relativePath);

      if (!createSourceDataDTO.success) {
        this.logger.error(`Failed to register the new source data after correct upload: ${createSourceDataDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "kp#upload",
            message: `Failed to register the new source data after correct upload: ${createSourceDataDTO.data.message}`,
          },
        };
      }

      // 4. Return a remote file object
      const newSourceDataRemoteFile = createSourceDataDTO.data;

      return {
        success: true,
        data: newSourceDataRemoteFile,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`An error occurred while uploading file: ${err.message}`);
      return {
        success: false,
        data: {
          operation: "kp#upload",
          message: `An error occurred while uploading file: ${err.message}`,
        },
      };
    }
  }

  async listSourceDataForResearchContext(researchContextID: number): Promise<ListSourceDataDTO> {
    this.logger.error("Browser Source Data Gateway: listSourceDataForResearchContext method deprecated");
    return {
      success: false,
      data: {
        operation: "browser#source-data#list",
        message: `Method deprecated`,
      },
    };
  }

  async listSourceDataForClient(): Promise<ListSourceDataDTO> {
    try {
      const dto = await this.api.gateways.sourceData.listSourceDataForClient.query();
      return dto;
    } catch (error) {
      this.logger.error({ error }, "Could not invoke the server side feature to get client data for download");
      return {
        success: false,
        data: {
          operation: "sourceDataRouter#list",
          message: "Could not invoke the server side feature to get client data for download",
        },
      };
    }
  }

  async get(fileID: string): Promise<GetSourceDataDTO> {
    throw new Error("Method not implemented.");
  }

  async delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
    throw new Error("Method not implemented.");
  }
}
