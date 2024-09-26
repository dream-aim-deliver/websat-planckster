import ResearchContextGatewayOutputPort from "~/lib/core/ports/secondary/research-context-gateway-output-port";
import { inject, injectable } from "inversify";
import { TListResearchContextDTO, TGetResearchContextDTO, TCreateResearchContextDTO } from "~/lib/core/dto/research-context-gateway-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import { Logger } from "pino";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS, KERNEL, UTILS } from "../config/ioc/server-ioc-symbols";
import type { TKernelSDK } from "../config/kernel/kernel-sdk";
import { TBaseErrorDTOData } from "~/sdk/core/dto";

@injectable()
export default class KernelResearchContextGateway implements ResearchContextGatewayOutputPort {
    private logger: Logger;
    constructor(
        @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
        @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    ) {
        this.logger = this.loggerFactory("ConversationGateway");
    }
    async list(): Promise<TListResearchContextDTO> {
        try {
            const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                this.logger.error({ kpCredentialsDTO }, `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
                return {
                    success: false,
                    data: {
                        operation: "kernel#research-context#create",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData,
                };
            }

            const researchContextsViewModel = await this.kernelSDK.listResearchContexts({
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
                id: kpCredentialsDTO.data.clientID,
            });

            if (!researchContextsViewModel.status) {
                this.logger.error({ researchContextsViewModel }, "Failed to get research contexts");

                return {
                    success: false,
                    data: {
                        operation: "kernel#research-context#create",
                        message: "Failed to get research contexts",
                    } as TBaseErrorDTOData,
                };
            }

            this.logger.debug({ researchContextsViewModel }, "Successfully fetched research contexts");
            return {
                success: true,
                data: researchContextsViewModel.research_contexts.map(researchContext => ({
                    id: researchContext.id,
                    title: researchContext.title,
                    description: researchContext.description,
                    status: "active",
                })),
            }


        } catch (error) {
            const err = error as Error;
            this.logger.error({ err }, `An error occurred while creating a research context: ${err.message}`);
            return {
                success: false,
                data: {
                    message: err.message,
                    operation: "kernel#research-context#create",
                } as TBaseErrorDTOData,
            };
        }
    }

    async get(researchContextID: string): Promise<TGetResearchContextDTO> {
        throw new Error("Method not implemented.");
    }

    async create(researchContextTitle: string, researchContextDescription: string, sourceData: RemoteFile[]): Promise<TCreateResearchContextDTO> {
        try {
            const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                this.logger.error({ kpCredentialsDTO }, `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`);
                return {
                    success: false,
                    data: {
                        operation: "kernel#research-context#create",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData,
                };
            }

            const newResearchContextViewModel = await this.kernelSDK.createResearchContext({
                llmName: "gpt4" as const,
                researchContextDescription: researchContextDescription,
                researchContextTitle: researchContextTitle,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
                requestBody: sourceData.map(file => parseInt(file.id)),
            });

            if (!newResearchContextViewModel.status) {
                this.logger.error({ newResearchContextViewModel }, `Failed to create research context '${researchContextTitle}'`);

                return {
                    success: false,
                    data: {
                        message: `Failed to create research context '${researchContextTitle}'`,
                        operation: "kernel#research-context#create",
                    } as TBaseErrorDTOData,
                };
            }
            this.logger.debug({ newResearchContextViewModel }, `Successfully created research context '${researchContextTitle}'`);

            return {
                success: true,
                data: {
                    id: newResearchContextViewModel.research_context_id,
                    title: researchContextTitle,
                    description: researchContextDescription,
                    status: "active",
                },
            };


        } catch (error) {
            const err = error as Error;
            this.logger.error({ err }, `An error occurred while creating a research context: ${err.message}`);
            return {
                success: false,
                data: {
                    message: err.message,
                    operation: "kernel#research-context#create",
                } as TBaseErrorDTOData,
            };
        }
    }
}