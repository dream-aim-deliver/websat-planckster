import { z } from "zod";

import { type SourceData } from "@maany_shr/kernel-planckster-sdk-ts";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type { TBaseErrorDTOData } from "~/sdk/core/dto";
import serverContainer from "../../../config/ioc/server-container";
import { CONTROLLERS, GATEWAYS, KERNEL, UTILS } from "../../../config/ioc/server-ioc-symbols";
import { type TKernelSDK } from "../../../config/kernel/kernel-sdk";
import { createTRPCRouter, protectedProcedure } from "../../server";
import { type Logger } from "pino";
import type ListSourceDataController from "../../../controller/list-source-data-controller";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";


const getLogger = () => {
  const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
  const logger = loggerFactory("conversationRouter");
  return logger;
}



export const sourceDataRouter = createTRPCRouter({

  list: protectedProcedure
    .input(
      z.object({
        researchContextID: z.number().optional(),
      }),
    )
    .query(async ({ input }): Promise<TListSourceDataViewModel> => {

      const ListSourceDataController = serverContainer.get<ListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);

      const viewModel = await ListSourceDataController.execute({
        researchContextID: input.researchContextID,
      });

      return viewModel;

    }),

  getUploadSignedUrl: protectedProcedure
    .input(
      z.object({
        protocol: z.string(),
        relativePath: z.string(), // TODO: validate that's a path that KP likes
      }),
    )
    .query(async ({ input }): Promise<
      {
        success: true,
        data: string
      } | {
        success: false,
        data: TBaseErrorDTOData
      }
    > => {

      const logger = getLogger();

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);

      const kpCredentialsDTO = await authGateway.extractKPCredentials();
      if (!kpCredentialsDTO.success) {
        logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "sourceDataRouter#getUploadSignedUrl",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        };
      }

      const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

      const signedUrlViewModel = await kernelSDK.getClientDataForUpload({
        id: kpCredentialsDTO.data.clientID,
        protocol: input.protocol,
        relativePath: input.relativePath,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      })

      if (signedUrlViewModel.status) {
        logger.debug(`Successfully got signed URL for upload`);
        const signedUrl = signedUrlViewModel.signed_url
        return {
          success: true,
          data: signedUrl,
        };
      }

      logger.error(`Failed to get signed URL for upload: ${signedUrlViewModel.errorMessage}`);
      return {
        success: false,
        data: {
          operation: "sourceDataRouter#getUploadSignedUrl",
          message: `Failed to get signed URL for upload: ${signedUrlViewModel.errorMessage}`,
        } as TBaseErrorDTOData
      }; // TODO: clean this, return a proper error DTO or a view model probably

    }),

  create: protectedProcedure
    .input(
      z.object({
        protocol: z.string(),
        relativePath: z.string(), // TODO: validate that's a path that KP likes
        sourceDataName: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<{
      success: true,
      data: SourceData
    } | {
      success: false,
      data: TBaseErrorDTOData
    }> => {

      const logger = getLogger();

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "sourceDataRouter#create",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        }
      }

      const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

      const registerSourceDataViewModel = await kernelSDK.registerSourceData({
        id: kpCredentialsDTO.data.clientID,
        sourceDataName: input.sourceDataName,
        sourceDataProtocol: input.protocol,
        sourceDataRelativePath: input.relativePath,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      })

      if (registerSourceDataViewModel.status && registerSourceDataViewModel.source_data) {
        logger.debug(`Successfully created source data`);
        return {
          success: true,
          data: registerSourceDataViewModel.source_data,
        };
      }

      logger.error(`Failed to create source data: ${registerSourceDataViewModel.errorMessage}`);

      return {
        success: false,
        data: {
          operation: "sourceDataRouter#create",
          message: registerSourceDataViewModel.errorMessage,
        } as TBaseErrorDTOData
      }
    }),

  getDownloadSignedUrl: protectedProcedure
    .input(
      z.object({
        protocol: z.string(),
        relativePath: z.string(),
      }),
    )
    .query(async ({ input }): Promise<
      {
        success: true,
        data: string
      } | {
        success: false,
        data: TBaseErrorDTOData
      }
    > => {

      const logger = getLogger();

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        logger.error(`Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "sourceDataRouter#getDownloadSignedUrl",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        };
      }

      const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

      const signedUrlViewModel = await kernelSDK.getClientDataForDownload({
        id: kpCredentialsDTO.data.clientID,
        protocol: input.protocol,
        relativePath: input.relativePath,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      })

      if (signedUrlViewModel.status) {
        logger.debug(`Successfully got signed URL for download`);
        const signedUrl = signedUrlViewModel.signed_url
        return {
          success: true,
          data: signedUrl,
        };
      }

      logger.error(`Failed to get signed URL for download. Dumping view model: ${signedUrlViewModel.errorMessage}`);

      return {
        success: false,
        data: {
          operation: "sourceDataRouter#getDownloadSignedUrl",
          message: `Failed to get signed URL for download: ${signedUrlViewModel.errorMessage}`,
        } as TBaseErrorDTOData
      };

    }),

});