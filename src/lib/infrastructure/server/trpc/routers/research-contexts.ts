import { z } from "zod";

import { ClientService as sdk } from "@maany_shr/kernel-planckster-sdk-ts";
import type { NewResearchContextViewModel } from "@maany_shr/kernel-planckster-sdk-ts";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "../../config/ioc/server-container";
import { GATEWAYS } from "../../config/ioc/server-ioc-symbols";
import { createTRPCRouter, protectedProcedure } from "../server";

export const researchContextRouter = createTRPCRouter({

  list: protectedProcedure
    .query(async () => {

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();

      if (!kpCredentialsDTO.success) {
        return [];
      }

      const viewModel = await sdk.listResearchContexts({
        id: kpCredentialsDTO.data.clientID,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
      });
      if (viewModel.status) {
        const researchContexts = viewModel.research_contexts;
        return researchContexts;
      }
      // TODO: handle error
      return [];
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        sourceDataIdList: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {

      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);

      const sessionDTO = await authGateway.getSession();
      if (!sessionDTO.success) {
        return [];
      }

      const kpCredentialsDTO = await authGateway.extractKPCredentials();
      if (!kpCredentialsDTO.success) {
        return []
      }

      const viewModel: NewResearchContextViewModel = await sdk.createResearchContext({
        clientSub: sessionDTO.data.user.email,  // TODO: fix this, sub is not always going to be the email
        requestBody: input.sourceDataIdList,
        xAuthToken: kpCredentialsDTO.data.xAuthToken,
        researchContextTitle: input.title,
        researchContextDescription: input.description,
      })
      if (viewModel.status) {
        return viewModel;
      }
      // TODO : handle error
      return {};
    }),
});