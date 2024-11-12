import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { type DownloadMapFilesDTO, type GetCaseStudyMetadataDTO } from "~/lib/core/dto/case-study-repository-dto";
import serverContainer from "../../../config/ioc/server-container";
import { type Logger } from "pino";
import { REPOSITORIES, UTILS } from "../../../config/ioc/server-ioc-symbols";
import { RemoteFileSchema } from "~/lib/core/entity/file";
import type SDACaseStudyRepository from "../../../repository/sda-case-study-repository";

export const caseStudyRepositoryRouter = createTRPCRouter({
  getMetadata: protectedProcedure
    .input(
      z.object({
        caseStudyName: z.string(),
        tracerID: z.string(),
        jobID: z.string(),
      }),
    )
    .query(async ({ input }): Promise<GetCaseStudyMetadataDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("GetCaseStudyMetadata TRPC Router");

      try {
        const repository = serverContainer.get<SDACaseStudyRepository>(REPOSITORIES.SDA_CASE_STUDY_REPOSITORY);

        const dto = await repository.getCaseStudyMetadata(input.caseStudyName, input.tracerID, input.jobID);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to get case study metadata");

        return {
          success: false,
          data: {
            operation: "caseStudyRouter#getCaseStudyMetadata",
            message: "Could not invoke the server side feature to get case study metadata",
          },
        };
      }
    }),

  downloadMapFiles: protectedProcedure
    .input(
      z.object({
        mapRemoteFiles: z.array(RemoteFileSchema),
      }),
    )
    .query(async ({ input }): Promise<DownloadMapFilesDTO> => {
      const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);

      const logger = loggerFactory("DownloadMapFiles TRPC Router");

      try {
        const repository = serverContainer.get<SDACaseStudyRepository>(REPOSITORIES.SDA_CASE_STUDY_REPOSITORY);

        const dto = await repository.downloadMapFiles(input.mapRemoteFiles);

        return dto;
      } catch (error) {
        logger.error({ error }, "Could not invoke the server side feature to download map files");

        return {
          success: false,
          data: {
            operation: "caseStudyRouter#downloadMapFiles",
            message: "Could not invoke the server side feature to download map files",
          },
        };
      }
    }),
});
