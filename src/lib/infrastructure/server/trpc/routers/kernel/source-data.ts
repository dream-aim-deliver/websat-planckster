import { z } from "zod";

import { ClientService as sdk, type SourceData } from "@maany_shr/kernel-planckster-sdk-ts";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type { TBaseErrorDTOData } from "~/sdk/core/dto";
import serverContainer from "../../../config/ioc/server-container";
import { GATEWAYS, KERNEL } from "../../../config/ioc/server-ioc-symbols";
import { type TKernelSDK } from "../../../config/kernel/kernel-sdk";
import { createTRPCRouter, protectedProcedure } from "../../server";

export const sourceDataRouter = createTRPCRouter({

  listForClient: protectedProcedure
    .query(async () => {

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "sourceDataRouter#listForClient",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        };
      }

      const viewModel = await sdk.listSourceData({
        id: kpCredentialsDTO.data.clientID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });
      if (viewModel.status) {
        const sources = viewModel.source_data_list
        return {
          success: true, data: sources,
        };
      }
      console.error(`Failed to get source data for client. Dumping view model: ${viewModel.errorMessage}`);
      return {
        success: false, data: {
          operation: "sourceDataRouter#listForClient",
          message: "Failed to get source data for client",
        } as TBaseErrorDTOData
      };

    }),

  getUploadSignedUrl: protectedProcedure
    .input(
      z.object({
        protocol: z.string(),
        relativePath: z.string(), // TODO: validate that's a path that KP likes
      }),
    )
    .query(async ({ input }) => {
      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();
      if (!kpCredentialsDTO.success) {
        console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "sourceDataRouter#getUploadSignedUrl",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        };
      }
      const kernelSDK: TKernelSDK =serverContainer.get(KERNEL.KERNEL_SDK);

      const signedUrlViewModel = await kernelSDK.getClientDataForUpload({
        id: kpCredentialsDTO.data.clientID,
        protocol: input.protocol,
        relativePath: input.relativePath,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      })

      if (signedUrlViewModel.status) {
        const signedUrl = signedUrlViewModel.signed_url
        return {
          success: true,
          data: signedUrl,
        };
      }
      console.error(`Failed to get signed URL for upload. Dumping view model: ${signedUrlViewModel.errorMessage}`);
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

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`);
        return {
          success: false,
          data: {
            operation: "sourceDataRouter#create",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        }
      }

      const registerSourceDataViewModel = await sdk.registerSourceData({
        id: kpCredentialsDTO.data.clientID,
        sourceDataName: input.sourceDataName,
        sourceDataProtocol: input.protocol,
        sourceDataRelativePath: input.relativePath,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      })

      if (registerSourceDataViewModel.status && registerSourceDataViewModel.source_data) {
        return {
          success: true,
          data: registerSourceDataViewModel.source_data,
        };
      }
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
    .query(async ({ input }) => {

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`);
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
        const signedUrl = signedUrlViewModel.signed_url
        return {
          success: true,
          data: signedUrl,
        };
      }

      console.error(`Failed to get signed URL for download. Dumping view model: ${signedUrlViewModel.errorMessage}`);

      return {
        success: false,
        data: {
          operation: "sourceDataRouter#getDownloadSignedUrl",
          message: `Failed to get signed URL for download: ${signedUrlViewModel.errorMessage}`,
        } as TBaseErrorDTOData
      };

    }),

  listForResearchContext: protectedProcedure
    .input(
      z.object({
        researchContextId: z.number(),
      }),
    )
    .query(async ({ input }) => {

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`);
        return [];
      }

      const viewModel = await sdk.listSourceDataForResearchContext({
        id: input.researchContextId,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });
      if (viewModel.status) {
        const sources = viewModel.source_data_list
        return sources;
      }
      console.error(`Failed to get source data for research context. Dumping view model: ${viewModel.errorMessage}`);
      return [];
    }),
});