import { inject, injectable } from "inversify";
import { Logger } from "pino";
import CaseStudyRepositoryOutputPort from "~/lib/core/ports/secondary/case-study-repository-output-port";
import { GATEWAYS, UTILS } from "../config/ioc/server-ioc-symbols";
import { GetCaseStudyMetadataDTO, TCaseStudyMetadataSuccessDTO } from "~/lib/core/dto/case-study-repository-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import fs from "fs";
import { CaseStudyMetadataSchema, ClimateRowSchema, DisasterRowSchema, ImageErrorSchema, MetadataImageSchema, TCaseStudyMetadata, TClimateKeyframe, TDisasterKeyframe, TImageError, TKeyframeImage } from "~/lib/core/entity/case-study-models";
import type KernelPlancksterSourceDataOutputPort from "../../common/ports/secondary/kernel-planckster-source-data-output-port";
import { ZodSchema } from "zod";

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

      // TODO: find a way to correctly parse file contents
      // The downloaded content might include additional headers (Content-Disposition). The code below attempts to remove those extra lines.
      let lines = rawContent.toString().split("\n");
      lines = lines.slice(3, -2);
      const cleanContent = lines.join("\n");

      const rawMetadataParseResult = CaseStudyMetadataSchema.safeParse(JSON.parse(cleanContent.toString()));

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

      // TODO: additional row schemas
      const caseStudyToSchema: Record<string, ZodSchema> = {
        "climate-monitoring": ClimateRowSchema,
        "disaster-tracking": DisasterRowSchema,
      };

      const RowSchema = caseStudyToSchema[caseStudy];

      if (!RowSchema) {
        this.logger.error({ caseStudy }, "Case study not supported.");
        return {
          success: false,
          data: {
            message: "Case study not supported.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }

      const keyFrames: TClimateKeyframe[] | TDisasterKeyframe[] = await Promise.all(
        metadata.data.map(async (rawKeyframe) => {
          const { timestamp, images: rawImages, data } = rawKeyframe;

          const parsedImages: (TKeyframeImage | TImageError)[] = [];

          for (const singleRawImage of rawImages) {
            const errorImageParseResult = ImageErrorSchema.safeParse(singleRawImage);
            const metadataImageParseResult = MetadataImageSchema.safeParse(singleRawImage);

            if (errorImageParseResult.success) {
              parsedImages.push(errorImageParseResult.data);
            } else if (metadataImageParseResult.success) {
              const { relativePath, description, kind } = metadataImageParseResult.data;

              const signedUrlDTO = await this.kernelSourceDataGateway.getClientDataForDownload(relativePath);

              if (!signedUrlDTO.success) {
                this.logger.error({ signedUrlDTO }, "Failed to get signed URL for image.");
                throw new Error("Failed to get signed URL for image.");
              }
              parsedImages.push({
                kind: kind,
                relativePath: relativePath,
                signedUrl: signedUrlDTO.data,
                description: description,
              });
            } else {
              this.logger.error({ imageDatum: singleRawImage }, "Failed to parse image metadata.");
              throw new Error("Failed to parse image metadata.");
            }
          }

          const parsedData = data.map((item) => {
            const result = RowSchema.safeParse(item);
            if (!result.success) {
              this.logger.error({ item }, "Invalid data.");
              throw new Error("Invalid data.");
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result.data;
          });

          return {
            timestamp: timestamp,
            images: parsedImages,
            data: parsedData,
          };
        }),
      );

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
