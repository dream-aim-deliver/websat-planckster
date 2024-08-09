import env from "~/lib/infrastructure/server/config/env";
import {OpenAPI as OpenAPIConfig } from "@maany_shr/kernel-planckster-sdk-ts";
import { ClientService } from "@maany_shr/kernel-planckster-sdk-ts";

OpenAPIConfig.BASE = env.KP_HOST!;

export const KernelSDK = ClientService;
export type TKernelSDK = typeof KernelSDK;
