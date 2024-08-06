import { z } from "zod";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import { createTRPCRouter, protectedProcedure } from "../server";
import serverContainer from "../../config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS } from "../../config/ioc/server-ioc-symbols";

export const sourceDataRouter = createTRPCRouter({

    listForClient: protectedProcedure
    .query(async () => {

        const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
        const kpCredentialsDTO = await authGateway.extractKPCredentials();

        if (!kpCredentialsDTO.success) {
            console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO}`);
            return [];
        }

        const viewModel = await sdk.listSourceData({
            id: kpCredentialsDTO.data.clientID, 
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
        });
        if(viewModel.status) {
            const sources = viewModel.source_data_list
            return sources;
        }
        console.error(`Failed to get source data for client. Dumping view model: ${viewModel}`);
        return [];

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
            console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO}`);
            return [];
        }

        const signedUrlViewModel = await sdk.getClientDataForUpload({
            id: kpCredentialsDTO.data.clientID,
            protocol: input.protocol,
            relativePath: input.relativePath,
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
        })

        if (signedUrlViewModel.status) {
          const signedUrl = signedUrlViewModel.signed_url
          return signedUrl;
        }
          console.error(`Failed to get signed URL for upload. Dumping view model: ${signedUrlViewModel}`);
          return [];
      }),

    create: protectedProcedure
      .input(
        z.object({
            protocol: z.string(),
            relativePath: z.string(), // TODO: validate that's a path that KP likes
            sourceDataName: z.string(),
        }),
      )
      .mutation(async ({ input }) => {

        const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
        const kpCredentialsDTO = await authGateway.extractKPCredentials();

        if (!kpCredentialsDTO.success) {
            console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO}`);
            return [];
        }

          const registerSourceDataViewModel = await sdk.registerSourceData({
              id: kpCredentialsDTO.data.clientID,
              sourceDataName: input.sourceDataName,
              sourceDataProtocol: input.protocol,
              sourceDataRelativePath: input.relativePath,
              xAuthToken: kpCredentialsDTO.data.xAuthToken,
          })

          if (registerSourceDataViewModel.status) {
              return registerSourceDataViewModel;
          }
          console.error(`Failed to register source data. Dumping view model: ${registerSourceDataViewModel}`);
          return [];
      }
      ),

    getDownloadSignedUrl: protectedProcedure
      .input(
        z.object({
            protocol: z.string(),
            relativePath: z.string(),
            localFilePath: z.string(),
        }),
      )
      .mutation(async ({ input }) => {

        const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
        const kpCredentialsDTO = await authGateway.extractKPCredentials();

        if (!kpCredentialsDTO.success) {
          console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO}`);
          return [];
        }

        const signedUrlViewModel = await sdk.getClientDataForDownload({
            id: kpCredentialsDTO.data.clientID,
            protocol: input.protocol,
            relativePath: input.relativePath,
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
        })
        if (signedUrlViewModel.status) {
          const signedUrl = signedUrlViewModel.signed_url

          return signedUrl;
        }
          console.error(`Failed to get signed URL for download. Dumping view model: ${signedUrlViewModel}`);
          return [];
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
            console.error(`Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO}`);
            return [];
        }

        const viewModel = await sdk.listSourceDataForResearchContext({
            id: input.researchContextId,
            xAuthToken: kpCredentialsDTO.data.xAuthToken,
        });
        if(viewModel.status) {
            const sources = viewModel.source_data_list
            return sources;
        }
        console.error(`Failed to get source data for research context. Dumping view model: ${viewModel}`); 
        return [];
    }),
});