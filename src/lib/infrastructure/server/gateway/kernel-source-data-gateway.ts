import { inject, injectable } from "inversify";
import { type ListSourceDataDTO, type GetSourceDataDTO, type UploadSourceDataDTO, type DownloadSourceDataDTO, type DeleteSourceDataDTO } from "~/lib/core/dto/source-data-gateway-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import { GATEWAYS, KERNEL, UTILS } from "../config/ioc/server-ioc-symbols";
import { Logger } from "pino";
import type { TKernelSDK } from "../config/kernel/kernel-sdk";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import axios from "axios";
import fs from "fs";
import * as stream from "stream";
import { promisify } from "util";
import { TBaseErrorDTOData } from "~/sdk/core/dto";

@injectable()
export default class KernelSourceDataGateway implements SourceDataGatewayOutputPort {
  private logger: Logger;
  constructor(
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
    @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
  ) {
    this.logger = this.loggerFactory("KernelSourceDataRepository");
  }

  async listSourceDataForClient(): Promise<ListSourceDataDTO> {
    try {
      const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        this.logger.error({ kpCredentialsDTO }, `Failed to extract KP credentials from the session.`);
        return {
          success: false,
          data: {
            operation: "kernel#source-data#list",
            message: kpCredentialsDTO.data.message,
          },
        };
      }

      const listSourceDataViewModel = await this.kernelSDK.listSourceData({
        id: kpCredentialsDTO.data.clientID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });

      if (!listSourceDataViewModel.status) {
        this.logger.error({ listSourceDataViewModel }, `Failed to get source data list.`);
        return {
          success: false,
          data: {
            operation: "kernel#source-data#list",
            message: `Failed to get source data list. Error: ${listSourceDataViewModel.errorMessage}`,
          },
        };
      }

      const sourceDataList = listSourceDataViewModel.source_data_list;
      const remoteFiles: RemoteFile[] = sourceDataList.map((sourceData) => {
        return {
          id: sourceData.id.toString(),
          type: "remote",
          provider: "kernel#s3",
          relativePath: sourceData.relative_path,
          name: sourceData.name,
          createdAt: sourceData.created_at,
        };
      });

      this.logger.debug({ listSourceDataViewModel }, `Successfully retrieved source data list.`);
      return {
        success: true,
        data: remoteFiles,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error({ err }, `Failed to get source data list.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data#list",
          message: `Failed to get source data list. Error: ${err.message}`,
        },
      };
    }
  }

  async listSourceDataForResearchContext(researchContextID: number): Promise<ListSourceDataDTO> {
    try {
      const kpCredentialsDTO = await this.authGateway.extractKPCredentials();
      if (!kpCredentialsDTO.success) {
        this.logger.error({ kpCredentialsDTO }, `Failed to extract KP credentials from the session.`);
        return {
          success: false,
          data: {
            operation: "kernel#source-data#list",
            message: kpCredentialsDTO.data.message,
          },
        };
      }

      const kernelListSourceDataViewModel = await this.kernelSDK.listSourceDataForResearchContext({
        id: researchContextID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });

      if (!kernelListSourceDataViewModel.status) {
        this.logger.error({ kernelListSourceDataViewModel }, `Failed to get source data list for research context ${researchContextID}.`);
        return {
          success: false,
          data: {
            operation: "kernel#source-data#list",
            message: `Failed to get source data list for research context ${researchContextID}. Error: ${kernelListSourceDataViewModel.errorMessage}`,
          },
        };
      }

      const sourceDataList = kernelListSourceDataViewModel.source_data_list;

      const remoteFiles: RemoteFile[] = sourceDataList.map((sourceData) => {
        return {
          id: sourceData.id.toString(),
          type: "remote",
          provider: "kernel#s3",
          relativePath: sourceData.relative_path,
          name: sourceData.name,
          createdAt: sourceData.created_at,
        };
      });

      return {
        success: true,
        data: remoteFiles,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(error, `Failed to get source data list for research context ${researchContextID}.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data__list",
          message: `Failed to get source data list for research context ${researchContextID}. Error: ${err.message}`,
        },
      };
    }
  }

  async get(fileID: string): Promise<GetSourceDataDTO> {
    return {
      success: false,
      data: {
        operation: "kernel#source-data#get",
        message: "Method not implemented.",
      },
    };
  }
  async upload(file: LocalFile, relativePath: string): Promise<UploadSourceDataDTO> {
    return {
      success: false,
      data: {
        operation: "kernel#source-data#upload",
        message: "Method not implemented.",
      },
    };
  }

  /**
   * Downloads a file from kernel to the local scratch space.
   * @param file
   * @param localPath
   */
  async download(file: RemoteFile, localPath?: string): Promise<DownloadSourceDataDTO> {
    // check if local scratch dir exists and generate local file path
    const scratchDir = process.env.SCRATCH_DIR ?? "/tmp";
    const localFilePath = localPath ?? `${scratchDir}/${file.relativePath}`;
    if (!fs.existsSync(scratchDir)) {
      this.logger.error(`Scratch directory ${scratchDir} does not exist.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data#download",
          message: `Scratch directory ${scratchDir} does not exist.`,
        },
      };
    }

    const kernelCredentialsDTO = await this.authGateway.extractKPCredentials();
    if (!kernelCredentialsDTO.success) {
      this.logger.error(kernelCredentialsDTO, `Failed to extract KP credentials from the session.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data#download",
          message: kernelCredentialsDTO.data.message,
        },
      };
    }

    this.logger.debug(`Downloading file ${file.relativePath} from kernel.`);
    if (file.provider !== "kernel#s3") {
      this.logger.error(`Invalid provider ${file.provider}. Expected kernel#s3.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data#download",
          message: `Invalid provider ${file.provider}. Expected kernel#s3.`,
        },
      };
    }

    let fileID: number;
    try {
      fileID = parseInt(file.id);
    } catch (error) {
      this.logger.error(error, `Failed to parse file ID ${file.id}. File IDs should be integers.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data#download",
          message: `Failed to parse file ID ${file.id}. File IDs should be integers.`,
        },
      };
    }

    const clientDataForDownloadDTO = await this.kernelSDK.getClientDataForDownload({
      id: fileID,
      protocol: "s3",
      relativePath: file.relativePath,
      xAuthToken: kernelCredentialsDTO.data.xAuthToken,
    });

    if (!clientDataForDownloadDTO.status) {
      this.logger.error(clientDataForDownloadDTO, `Failed to get client data for download.`);
      return {
        success: false,
        data: {
          operation: "kernel#source-data#download",
          message: `Failed to get signed url for download. File ID: ${file.id}. Error: ${clientDataForDownloadDTO.errorMessage}`,
        },
      };
    }

    const signedUrl = clientDataForDownloadDTO.signed_url;

    const finished = promisify(stream.finished);
    const fileStream = fs.createWriteStream(localFilePath);
    let errorData: TBaseErrorDTOData | undefined;

    const response = await axios.get(signedUrl, {
      responseType: "stream",
    });
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    response.data.pipe(fileStream);

    try {
      await finished(fileStream);
    } catch (error) {
      this.logger.error(error, `Failed to write file to local path ${localFilePath}.`);
      errorData = {
        operation: "kernel#source-data#download",
        message: `Failed to write file to local path ${localFilePath}.`,
      };
    }

    if (errorData) {
      return {
        success: false,
        data: errorData,
      };
    }
    return {
      success: true,
      data: {
        type: "local",
        relativePath: localFilePath,
        name: file.name,
      },
    };
  }

  async delete(file: RemoteFile): Promise<DeleteSourceDataDTO> {
    return {
      success: false,
      data: {
        operation: "kernel#source-data#delete",
        message: "Method not implemented.",
      },
    };
  }
}
