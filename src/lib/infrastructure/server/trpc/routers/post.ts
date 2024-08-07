import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../server";
import serverContainer from "../../config/ioc/server-container";
import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS } from "../../config/ioc/server-ioc-symbols";

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
      const kpCredentialsDTO = await authGateway.extractKPCredentials();
      if (!kpCredentialsDTO.success) {
        throw new Error("You are not authorized to create a post");
      }
      
      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: protectedProcedure.query(() => {
    return post;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
