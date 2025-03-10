import { inject, injectable } from "inversify";
import { Logger } from "pino";
import CaseStudyRepositoryOutputPort from "~/lib/core/ports/secondary/case-study-repository-output-port";
import { GATEWAYS, UTILS } from "../config/ioc/server-ioc-symbols";
import { GetCaseStudyMetadataDTO } from "~/lib/core/dto/case-study-repository-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import fs from "fs";
import {
  ClimateRowSchema,
  ErrorSchema,
  SentinelRowSchema,
  SwissGridRowSchema,
  TCaseStudyMetadata,
  TKeyframeArray,
} from "~/lib/core/entity/case-study-models";
import type KernelPlancksterSourceDataOutputPort from "../../common/ports/secondary/kernel-planckster-source-data-output-port";
import { RawCaseStudyMetadataSchema, TRawCaseStudyMetadata, generateMetadataRelativePath } from "../utils/sda-case-study-utils";

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

      // 1. Prepare download of the metadata file
      const metadataRelativePath = generateMetadataRelativePath(caseStudyName, tracerID, jobID);

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
        this.logger.error({ downloadDTO }, "Failed to download metadata file.");
        return {
          success: false,
          data: {
            message: "Failed to download metadata file.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }

      const localPath = downloadDTO.data.relativePath;

      // 2. Parse the metadata
      const rawContent = fs.readFileSync(localPath);
      const rawMetadataParseResult = RawCaseStudyMetadataSchema.safeParse(JSON.parse(rawContent.toString()));

      if (!rawMetadataParseResult.success) {
        console.log(rawMetadataParseResult.error.message);
        this.logger.error({ rawMetadataParseResult }, "Failed to parse metadata.");
        return {
          success: false,
          data: {
            message: "Failed to parse metadata.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }
      const metadata: TRawCaseStudyMetadata = rawMetadataParseResult.data;

      const caseStudy = metadata.caseStudy;
      if (caseStudy !== caseStudyName) {
        this.logger.error({ caseStudy, caseStudyName }, "Case study name mismatch.");
        return {
          success: false,
          data: {
            message: "Case study name mismatch.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }

      // 3. Process keyframes

      const expirationTime = new Date(Date.now() + 60 * 60 * 1000).getTime();

      const caseStudySchemas = {
        'climate-monitoring': ClimateRowSchema,
        'sentinel-5p': SentinelRowSchema,
        'swissgrid': SwissGridRowSchema,
      };

      if (!Object.keys(caseStudySchemas).includes(caseStudy)) {
        this.logger.error({ caseStudy }, "Case study not supported.");
        return {
          success: false,
          data: {
            message: "Case study not supported.",
            operation: "sdaCaseStudy#getCaseStudyMetadata",
          },
        };
      }

      const keyframes: TKeyframeArray = await Promise.all(
          metadata.keyframes.map(async (rawKeyframe) => {
            const { timestamp, images, data } = rawKeyframe;

            const parsedData = data.map((item) => {
              const successSchemaParseResult = caseStudySchemas[caseStudy].safeParse(item);
              const errorSchemaParseResult = ErrorSchema.safeParse(item);

              if (!errorSchemaParseResult.success && !successSchemaParseResult.success) {
                this.logger.error({ item }, 'Failed to parse a data row.');
                return {
                    errorMessage: "Failed to parse a data row.",
                    errorName: "DataParseError",
                }
              }
              return item;
            });

            return {
              timestamp: timestamp,
              images: images,
              data: parsedData,
              dataDescription: rawKeyframe.dataDescription,
            };
          })
      ) as TKeyframeArray;

      // 4. Reconstruct metadata
      const successMetadata = {
        caseStudy: caseStudy,
        keyframes: keyframes,
        imageKinds: metadata.imageKinds,
        relativePathsForAgent: metadata.relativePathsForAgent,
        expirationTime: expirationTime,
      } as TCaseStudyMetadata;

      return {
        success: true,
        data: successMetadata,
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
