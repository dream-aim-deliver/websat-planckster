import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";

import { downloadFile, uploadFile } from "~/infrastructure/file-repository";

import { env } from "~/env";

export const sourceDataRouter = createTRPCRouter({
    listForClient: protectedProcedure
    .input(
        z.object({
            clientId: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listSourceData({
            id: input.clientId ?? env.KP_CLIENT_ID,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const sources = viewModel.source_data_list
            return sources;
        }
        // TODO: handle errors
        return [];

    }),

    create: protectedProcedure
      .input(
        z.object({
            clientId: z.number(),
            protocol: z.string(),
            xAuthToken: z.string(),
            relativePath: z.string(), // TODO: validate that's a path that KP likes
            sourceDataName: z.string(),
            localFilePath: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const clientID = input.clientId ?? env.KP_CLIENT_ID
        const authToken = input.xAuthToken || env.KP_AUTH_TOKEN

        // 1. Use KP to get signed URL
        const signedUrlViewModel = await sdk.getClientDataForUpload({
            id: clientID,
            protocol: input.protocol,
            relativePath: input.relativePath,
            xAuthToken: authToken,
        })
        if (signedUrlViewModel.status) {
          const signedUrl = signedUrlViewModel.signed_url

          // 2. Use File Repository to upload
          const uploadDto = await uploadFile(signedUrl, input.localFilePath)
          
          if (uploadDto.status) {

            // 3. Use KP to register the uploaded source data
            const registerSourceDataViewModel = await sdk.registerSourceData({
                id: clientID,
                sourceDataName: input.sourceDataName,
                sourceDataProtocol: input.protocol,
                sourceDataRelativePath: input.relativePath,
                xAuthToken: authToken,
            })

            if (registerSourceDataViewModel.status) {
                return registerSourceDataViewModel;
            }
            // TODO: handle register error; note that this means there's an uploaded file whose metadata is NOT registered
            return [];

          }
          // TODO: handle upload error
          return [];

        }
        // TODO: handle signed URL fail error
        return [];


      }),

    // download logic: (1) use KP to get signed URL, (2) use thin file repository to download the file
    // IN: relative path, client ID, xAuthToken, protocol
    download: protectedProcedure
      .input(
        z.object({
            clientId: z.number(),
            protocol: z.string(),
            xAuthToken: z.string(),
            relativePath: z.string(),
            localFilePath: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const clientID = input.clientId ?? env.KP_CLIENT_ID
        const authToken = input.xAuthToken || env.KP_AUTH_TOKEN

        // 1. Use KP to get signed URL
        const signedUrlViewModel = await sdk.getClientDataForDownload({
            id: clientID,
            protocol: input.protocol,
            relativePath: input.relativePath,
            xAuthToken: authToken,
        })
        if (signedUrlViewModel.status) {
          const signedUrl = signedUrlViewModel.signed_url

          // 2. Use File Repository to download
          const downloadDto = await downloadFile(signedUrl, input.localFilePath)
          
          if (downloadDto.status) {
            return downloadDto;
          }
          // TODO: handle download error
          return [];
        }
        // TODO: handle signed URL fail error
        return [];
      }),

    listForResearchContext: protectedProcedure
    .input(
        z.object({
            researchContextId: z.number(),
            xAuthToken: z.string(),
        }),
    )
    .query(async ({ input }) => {
        const viewModel = await sdk.listSourceDataForResearchContext({
            id: input.researchContextId,
            xAuthToken: input.xAuthToken || env.KP_AUTH_TOKEN,
        });
        if(viewModel.status) {
            const sources = viewModel.source_data_list
            return sources;
        }
        // TODO: check if error can be handled
        return [];
    }),
});