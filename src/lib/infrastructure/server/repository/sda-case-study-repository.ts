import { inject, injectable } from "inversify";
import { Logger } from "pino";
import CaseStudyRepositoryOutputPort from "~/lib/core/ports/secondary/case-study-repository-output-port";
import { GATEWAYS, UTILS } from "../config/ioc/server-ioc-symbols";
import { DownloadMapFilesDTO, GetCaseStudyMetadataDTO } from "~/lib/core/dto/case-study-repository-dto";
import { LocalFile, RemoteFile } from "~/lib/core/entity/file";
import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import fs from "fs";

@injectable()
export default class SDACaseStudyRepository implements CaseStudyRepositoryOutputPort {
  private logger: Logger;
  constructor(
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    @inject(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY) private kernelSourceDataGateway: SourceDataGatewayOutputPort,
  ) {
    this.logger = this.loggerFactory("SDACaseStudyRepository");
  }

  async getCaseStudyMetadata(caseStudyName: string, tracerID: string, jobID: string): Promise<GetCaseStudyMetadataDTO> {
    try {
      // TODO: concrete implementation of get case study metadata, after we standardize the scrapers
      return {
        success: false,
        data: {
          message: "Method not implemented yet.",
          operation: "sdaCaseStudy#getCaseStudyMetadata",
        },
      };
    } catch (error) {
      this.logger.error({ error }, "Error while attempting to get case study metadata.");
      return {
        success: false,
        data: {
          message: "Error while attempting to get case study metadata.",
          operation: "sdaCaseStudy#getCaseStudyMetadata",
        },
      };
    }
  }

  async downloadMapFiles(mapRemoteFiles: RemoteFile[]): Promise<DownloadMapFilesDTO> {
    try {
      if (mapRemoteFiles.length === 0) {
        return {
          success: false,
          data: {
            message: "No map files to download.",
            operation: "sdaCaseStudy#downloadMapFiles",
          },
        };
      }

      // 1. Assert that all files' provider has the substring "kernel"
      const kernelFiles = mapRemoteFiles.filter((file) => file.provider.includes("kernel"));
      if (kernelFiles.length !== mapRemoteFiles.length) {
        return {
          success: false,
          data: {
            message: "All files must have kernel as provider.",
            operation: "sdaCaseStudy#downloadMapFiles",
          },
        };
      }

      // 2. Construct a base folder to save the files
      const baseFolder = `${process.cwd()}/case-study-websat-downloads`; // TODO: is this directory name good?
      // create the folder if it doesn't exist
      fs.mkdirSync(baseFolder, { recursive: true });

      // 3. Download the files using the kernel gateway
      const downloadedFiles: LocalFile[] = [];
      const downloadErrorFiles: RemoteFile[] = [];

      for (const file of kernelFiles) {
        const localPath = `${baseFolder}${file.relativePath}`;
        const fileDownloadDTO = await this.kernelSourceDataGateway.download(file);
        if (!fileDownloadDTO.success) {
          downloadErrorFiles.push(file);
          continue;
        } else {
          downloadedFiles.push({
            type: "local",
            relativePath: localPath,
            name: file.name,
          });
        }
      }

      if (downloadErrorFiles.length > 0) {
        this.logger.error({ downloadErrorFiles }, "Error while downloading some map images for a case study.");
        return {
          success: false,
          data: {
            message: "Error while downloading some map images for a case study.",
            operation: "sdaCaseStudy#downloadMapFiles",
          },
        };
      }

      // 4. Return the downloaded files
      return {
        success: true,
        data: downloadedFiles,
      };
    } catch (error) {
      this.logger.error({ error }, "Error while attempting to download map files.");
      return {
        success: false,
        data: {
          message: "Error while attempting to download map files.",
          operation: "sdaCaseStudy#downloadMapFiles",
        },
      };
    }
  }
}
