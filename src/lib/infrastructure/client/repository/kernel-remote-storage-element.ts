import axios from "axios";

import type {
  UploadFileDTO,
  DownloadFileDTO,
} from "~/lib/core/dto/remote-storage-repository-dto";
import type { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import { inject, injectable } from "inversify";
import { TRPC, UTILS } from "../config/ioc/client-ioc-symbols";
import type { TVanillaAPI } from "../trpc/vanilla-api";
import RemoteStorageElementOutputPort from "~/lib/core/ports/secondary/remote-storage-element-output-port";
import { TBaseErrorDTOData } from "~/sdk/core/dto";
import { Logger } from "pino";

/**
 * Represents a class that interacts with a remote storage element that is managed by kernel.
 * In the v1 and v2 versions of the kernel, the remote storage element is an S3 bucket.
 * Uploads and Downloads are done using signed URLs.
 */
@injectable()
export default class KernelRemoteStorageElement implements RemoteStorageElementOutputPort {
  private logger: Logger
  constructor(
    @inject(TRPC.VANILLA_CLIENT) private api: TVanillaAPI,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger
  ) {
    this.logger = this.loggerFactory("KernelRemoteStorageElement")
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
        return {
          success: false,
          data: {
            message: `Could not get signed url from the TRPC server.`,
            operation: "kp-file-repository#get-upload-signed-url",
          },
        };
      }
      if (!response.success) {
        return {
          success: false,
          data: {
            message: `An error occurred. Error: ${JSON.stringify(response.data, null, 2)}`,
            operation: "kp#get-upload-signed-url",
          },
        };
      }

      const signedUrl = response.data;

      if (!signedUrl || typeof signedUrl !== "string") {
        return {
          success: false,
          data: {
            message: `An error occurred. Signed URL received from TRPC server is null: ${JSON.stringify(response)}`,
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
      return {
        success: false,
        data: {
          message: `An error occurred. Error: ${err.message}`,
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
    throw new Error("Method not implemented.");
    // try {

    //     const getDownloadSignedUrlQuery = this.api.kernel.sourceData.getDownloadSignedUrl.useQuery({
    //         protocol: protocol,
    //         relativePath: relativePath,
    //     });

    //     if (getDownloadSignedUrlQuery.error) {
    //         return {
    //             success: false,
    //             data: {
    //                 message: `An error occurred. TRPC server query failed: ${JSON.stringify(getDownloadSignedUrlQuery.error)}`,
    //                 operation: "kp#get-download-signed-url",
    //             }
    //         }
    //     }

    //     const signedUrl = getDownloadSignedUrlQuery.data;

    //     if (!signedUrl || signedUrl.length === 0 || typeof signedUrl !== 'string') {
    //         return {
    //             success: false,
    //             data: {
    //                 message: `An error occurred. Signed URL received from TRPC server is null: ${getDownloadSignedUrlQuery.error}`,
    //                 operation: "kp#get-download-signed-url",
    //             }
    //         }
    //     }

    //     return {
    //         success: true,
    //         data: {
    //             type: "download-signed-url",
    //             url: signedUrl
    //         }
    //     }
    // }

    // catch (error: unknown) {
    //     const err = error as Error;
    //     return {
    //         success: false,
    //         data: {
    //             message: `An error occurred. Error: ${err.message}`,
    //             operation: "kp#get-download-signed-url",
    //         }
    //     }
    // }
  }

  /**
   * Uploads a file to the remote storage managed by Kernel.
   *
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to an UploadFileDTO object containing the result of the upload operation.
   */
  async uploadFile(file: LocalFile): Promise<UploadFileDTO> {
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
        path: relativePath,
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

  /**
   * Downloads a file from a remote storage and saves it locally.
   *
   * @param file - The remote file to download.
   * @param localPath - The local path where the file will be saved.
   * @returns A promise that resolves to a DownloadFileDTO object containing the result of the download operation.
   */
  async downloadFile(
    file: RemoteFile,
    localPath: string,
  ): Promise<DownloadFileDTO> {
    try {
      // 1. Get signed URL for download
      const signedUrlDTO = await this.__getDownloadSignedUrl("s3", file.path);

      if (!signedUrlDTO.success) {
        return {
          success: false,
          data: {
            operation: "kp#download",
            message: `Failed to get signed URL for download: ${signedUrlDTO.data.message}`,
          },
        };
      }

      const signedUrl = signedUrlDTO.data.url;

      // 2. Fetch file from signed URL
      const response = await fetch(signedUrl);

      if (!response.ok) {
        return {
          success: false,
          data: {
            operation: "kp#download",
            message: `Failed to download file. Status code: ${response.status}. Message: ${response.statusText}`,
          },
        };
      }

      // 3. Create a blob from the response
      const blob = await response.blob();

      // 4. Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = localPath;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const localFile: LocalFile = {
        type: "local",
        path: localPath, // NOTE: this is the default download path, user might have changed it
      };

      return {
        success: true,
        data: localFile,
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        success: false,
        data: {
          operation: "kp#download",
          message: `An error occurred: ${err.message}`,
        },
      };
    }
  }
}
