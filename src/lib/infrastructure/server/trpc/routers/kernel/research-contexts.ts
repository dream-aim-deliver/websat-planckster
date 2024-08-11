import { z } from "zod";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import type { NewResearchContextViewModel } from "@maany_shr/kernel-planckster-sdk-ts";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "../../../config/ioc/server-container";
import { GATEWAYS, KERNEL, UTILS } from "../../../config/ioc/server-ioc-symbols";
import { createTRPCRouter, protectedProcedure } from "../../server";
import type { TBaseErrorDTOData } from "~/sdk/core/dto";
import type { TKernelSDK } from "../../../config/kernel/kernel-sdk";
import { Logger } from "pino";

const getLogger = () => {
  const loggerFactory = serverContainer.get<(module: string) => Logger>(UTILS.LOGGER_FACTORY);
  const logger = loggerFactory("conversationRouter");
  return logger;
}

export const researchContextRouter = createTRPCRouter({

  list: protectedProcedure
    .query(async () => {

      const logger = getLogger();
      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        // console.log(
        logger.info(
          `Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`
        );
        return {
          success: false,
          data: {
            operation: "researchContextRouter#list",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        };
      }

      const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

      const listResearchContextsViewModel = await kernelSDK.listResearchContexts({
        id: kpCredentialsDTO.data.clientID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });
      if (listResearchContextsViewModel.status) {
        const researchContexts = listResearchContextsViewModel.research_contexts;
        return researchContexts;
      }

      // console.log(
      logger.info(
        `Failed to get signed URL for upload. Dumping view model: ${listResearchContextsViewModel.errorMessage}`
      );

      return {
          success: false,
          data: {
            operation: "researchContextRouter#list",
            message: `Failed to list Research Contexts with Client ID ${kpCredentialsDTO.data.clientID}`,
          } as TBaseErrorDTOData
        };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        sourceDataIdList: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }): Promise<{
      success: true,
      data: NewResearchContextViewModel
    } | {
      success: false,
      data: TBaseErrorDTOData
    }> => {

      const logger = getLogger();
      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const sessionDTO = await authGateway.getSession();
        if (!sessionDTO.success) {
          return {
            success: false,
            data: {
              operation: "researchContextRouter#create",
              message: "Failed to authenticate session. Login required.",
            } as TBaseErrorDTOData
          }; 
        }

      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        // console.log(
        logger.info(
          `Failed to get KP credentials. Dumping DTO: ${kpCredentialsDTO.data.message}`
        );
        return {
          success: false,
          data: {
            operation: "researchContextRouter#create",
            message: "Failed to get KP credentials",
          } as TBaseErrorDTOData
        };
      }

      const kernelSDK: TKernelSDK = serverContainer.get(KERNEL.KERNEL_SDK);

      const newResearchViewModel: NewResearchContextViewModel = await kernelSDK.createResearchContext({
        clientSub: sessionDTO.data.user.email,  // TODO: fix this, sub is not always going to be the email
        requestBody: input.sourceDataIdList,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
        researchContextTitle: input.title,
        researchContextDescription: input.description,
      })

      if (newResearchViewModel.status) {
        return {
          success: true,
          data: newResearchViewModel
        };
      }

      return {
        success: false,
        data: {
          operation: "researchContextRouter#create",
          message: newResearchViewModel.errorMessage ?? "Unknown error when attempting to create Research Context",
        }
      };
    }),
});