import { inject, injectable } from "inversify";
import { Logger } from "pino";
import CaseStudyRepositoryOutputPort from "~/lib/core/ports/secondary/case-study-repository-output-port";
import { GATEWAYS, UTILS } from "../config/ioc/server-ioc-symbols";
import { GetCaseStudyMetadataDTO, TCaseStudyMetadataSuccessDTO } from "~/lib/core/dto/case-study-repository-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import fs from "fs";
import {
  CaseStudyMetadataSchema,
  ClimateRowSchema,
  DisasterRowSchema,
  ImageErrorSchema,
  MetadataImageSchema,
  TCaseStudyMetadata,
  TClimateDatum,
  TClimateKeyframe,
  TDisasterDatum,
  TDisasterKeyframe,
  TImageError,
} from "~/lib/core/entity/case-study-models";
import type KernelPlancksterSourceDataOutputPort from "../../common/ports/secondary/kernel-planckster-source-data-output-port";

@injectable()
export default class SDACaseStudyRepository implements CaseStudyRepositoryOutputPort {
  private logger: Logger;
  constructor(
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    @inject(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY) private kernelSourceDataGateway: KernelPlancksterSourceDataOutputPort,
  ) {
    this.logger = this.loggerFactory("SDACaseStudyRepository");
  }

  async getCaseStudyMetadata(caseStudyName: string, tracerID: string, jobID: number): Promise<GetCaseStudyMetadataDTO> {
    try {
      // TODO: concrete implementation of get case study metadata, after we standardize the scrapers

      this.logger.info({ caseStudyName, tracerID, jobID }, "Getting case study metadata.");

      const metadataRelativePath = `${caseStudyName}/${tracerID}/${jobID}/metadata.json`;

      const metadataRemoteFile: RemoteFile = {
        id: "",
        type: "remote",
        provider: "kernel#s3",
        name: "metadata.json",
        relativePath: metadataRelativePath,
        createdAt: "",
      };

      const downloadDTO = await this.kernelSourceDataGateway.download(metadataRemoteFile);

      if (!downloadDTO.success) {
        return {
          success: false,
          data: {
            message: "Failed to download metadata file.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }

      const localPath = downloadDTO.data.relativePath;

      const rawContent = fs.readFileSync(localPath);

      const rawMetadataParseResult = CaseStudyMetadataSchema.safeParse(JSON.parse(rawContent.toString()));

      if (!rawMetadataParseResult.success) {
        this.logger.error({ metadata: rawContent.toString() }, "Failed to parse metadata.");
        return {
          success: false,
          data: {
            message: "Failed to parse metadata.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }
      const metadata: TCaseStudyMetadata = rawMetadataParseResult.data;

      const caseStudy = metadata.caseStudy;

      const expirationTime = new Date(Date.now() + 60 * 60 * 1000).getTime();

      let keyFrames: TClimateKeyframe[] | TDisasterKeyframe[];

      if (caseStudy === "climate-monitoring") {
        keyFrames = await Promise.all(
          metadata.data.map(async (rawKeyframe) => {
            const { timestamp, image: imageDatum, data } = rawKeyframe;

            let image: { relativePath: string; signedUrl: string; description: string } | TImageError;

            const errorImageParseResult = ImageErrorSchema.safeParse(imageDatum);
            const metadataImageParseResult = MetadataImageSchema.safeParse(imageDatum);

            if (errorImageParseResult.success) {
              image = errorImageParseResult.data;
            } else if (metadataImageParseResult.success) {
              const { relativePath, description } = metadataImageParseResult.data;

              const signedUrlDTO = await this.kernelSourceDataGateway.getClientDataForDownload(relativePath);

              if (!signedUrlDTO.success) {
                this.logger.error({ signedUrlDTO }, "Failed to get signed URL for image.");
                throw new Error("Failed to get signed URL for image.");
              }
              image = {
                relativePath: relativePath,
                signedUrl: signedUrlDTO.data,
                description: description,
              };
            } else {
              this.logger.error({ imageDatum }, "Failed to parse image metadata.");
              throw new Error("Failed to parse image metadata.");
            }

            const parsedData = data.map((item) => {
              const result = ClimateRowSchema.safeParse(item);
              if (!result.success) {
                this.logger.error({ item }, "Invalid ClimateRow data.");
                throw new Error("Invalid ClimateRow data.");
              }
              return result.data; // Validated TClimateDatum
            });

            return {
              timestamp: timestamp,
              image: image,
              data: parsedData as TClimateDatum[],
            } as TClimateKeyframe;
          }),
        );
      } else if (caseStudy === "disaster-tracking") {
        keyFrames = await Promise.all(
          metadata.data.map(async (rawKeyframe) => {
            const { timestamp, image: imageDatum, data } = rawKeyframe;

            let image: { relativePath: string; signedUrl: string; description: string } | TImageError;

            const errorImageParseResult = ImageErrorSchema.safeParse(imageDatum);
            const metadataImageParseResult = MetadataImageSchema.safeParse(imageDatum);

            if (errorImageParseResult.success) {
              image = errorImageParseResult.data;
            } else if (metadataImageParseResult.success) {
              const { relativePath, description } = metadataImageParseResult.data;

              const signedUrlDTO = await this.kernelSourceDataGateway.getClientDataForDownload(relativePath);

              if (!signedUrlDTO.success) {
                this.logger.error({ signedUrlDTO }, "Failed to get signed URL for image.");
                throw new Error("Failed to get signed URL for image.");
              }
              image = {
                relativePath: relativePath,
                signedUrl: signedUrlDTO.data,
                description: description,
              };
            } else {
              this.logger.error({ imageDatum }, "Failed to parse image metadata.");
              throw new Error("Failed to parse image metadata.");
            }

            const parsedData = data.map((item) => {
              const result = DisasterRowSchema.safeParse(item);
              if (!result.success) {
                this.logger.error({ item }, "Invalid DisasterRow data.");
                throw new Error("Invalid DisasterRow data.");
              }
              return result.data; // Validated TDisasterDatum
            });

            return {
              timestamp,
              image,
              data: parsedData as TDisasterDatum[], // Now safely TDisasterDatum[]
            } as TDisasterKeyframe;
          }),
        );
      } else {
        this.logger.error({ caseStudy }, "Case study not supported.");
        return {
          success: false,
          data: {
            message: "Case study not supported.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }

      const successData = {
        caseStudy: metadata.caseStudy,
        keyFrames: keyFrames,
        expirationTime: expirationTime,
        relativePathsForAgent: metadata.relativePathsForAgent,
      } as TCaseStudyMetadataSuccessDTO;

      return {
        success: true,
        data: successData,
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
}
