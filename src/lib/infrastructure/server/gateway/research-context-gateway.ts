import { inject, injectable } from "inversify";
import { Logger } from "pino";
import { TListResearchContextDTO, TGetResearchContextDTO, TCreateResearchContextDTO } from "~/lib/core/dto/research-context-gateway-dto";
import { RemoteFile } from "~/lib/core/entity/file";
import ResearchContextGatewayOutputPort from "~/lib/core/ports/secondary/research-context-gateway-output-port";
import { GATEWAYS, KERNEL, UTILS } from "../config/ioc/server-ioc-symbols";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { type TKernelSDK } from "../config/kernel/kernel-sdk";
import { TBaseErrorDTOData } from "~/sdk/core/dto";

@injectable()
export default class ResearchContextGateway implements ResearchContextGatewayOutputPort {

    private logger: Logger
    constructor(
    @inject(GATEWAYS.AUTH_GATEWAY) private authGateway: AuthGatewayOutputPort,
    @inject(KERNEL.KERNEL_SDK) private kernelSDK: TKernelSDK,
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger
    ) {
    this.logger = this.loggerFactory("ConversationGateway")
    }

    list(): Promise<TListResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
    get(researchContextID: string): Promise<TGetResearchContextDTO> {
        throw new Error("Method not implemented.");
    }

    async create(researchContextTitle: string, researchContextDescription: string, sourceData: RemoteFile[]): Promise<TCreateResearchContextDTO> {
        try {

            const kpCredentialsDTO = await this.authGateway.extractKPCredentials();

            if (!kpCredentialsDTO.success) {
                this.logger.error(
                    `Failed to get KP credentials: ${kpCredentialsDTO.data.message}`
                );
                return {
                    success: false,
                    data: {
                        operation: "kernel#research-context#create",
                        message: "Failed to get KP credentials",
                    } as TBaseErrorDTOData
                };
            }

            const sessionDTO = await this.authGateway.getSession();

            if (!sessionDTO.success) {
                this.logger.error(
                    `Failed to get session: ${sessionDTO.data.message}`
                );
                return {
                    success: false,
                    data: {
                        operation: "kernel#research-context#create",
                        message: "Failed to get session",
                    } as TBaseErrorDTOData
                };
            }

            const email = sessionDTO.data.user.email;

            const sourceDataIDs = sourceData.map((file) => parseInt(file.id));

            const newResearchContextViewModel = await this.kernelSDK.createResearchContext({
                clientSub: email,
                requestBody: sourceDataIDs,
                researchContextTitle: researchContextTitle,
                researchContextDescription: researchContextDescription,
                xAuthToken: kpCredentialsDTO.data.xAuthToken,
            });

            if (newResearchContextViewModel.status) {
                this.logger.debug(`Successfully created Research Context '${researchContextTitle}'. View model code: ${newResearchContextViewModel.code}`);
                
                return {
                    success: true,
                    data: {
                        id: newResearchContextViewModel.research_context_id,
                        title: researchContextTitle,
                        description: researchContextDescription,
                        status: "active",
                    }
                };
            }

            this.logger.error(`Failed to create Research Context: ${newResearchContextViewModel.errorMessage}`);

            return {
                success: false,
                data: {
                    operation: "kernel#research-context#create",
                    message: `Failed to create Research Context`,
                }
            }


        } catch (error) {
            const err = error as Error;
            this.logger.error(`An error occurred while trying to create a Research Context: ${err.message}`);
            return {
                success: false,
                data: {
                    operation: "kernel#research-context#create",
                    message: err.message,
                }
            }
        }

    }
    
}