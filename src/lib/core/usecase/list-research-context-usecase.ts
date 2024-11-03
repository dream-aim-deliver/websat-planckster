import type { TListResearchContextDTO } from "../dto/research-context-gateway-dto";
import { type ListResearchContextsInputPort, type ListResearchContextsOutputPort } from "../ports/primary/list-research-contexts-primary-ports";
import type ResearchContextGatewayOutputPort from "../ports/secondary/research-context-gateway-output-port";
import { type TListResearchContextsResponse } from "../usecase-models/list-research-contexts-usecase-models";

export default class ListResearchContextsUsecase implements ListResearchContextsInputPort {
    presenter: ListResearchContextsOutputPort;
    researchContextGateway: ResearchContextGatewayOutputPort;
    
    constructor(presenter: ListResearchContextsOutputPort, researchContextGateway: ResearchContextGatewayOutputPort) {
        this.presenter = presenter;
        this.researchContextGateway = researchContextGateway;
    }
    
    async execute(): Promise<void> {
        try {
            const dto: TListResearchContextDTO = await this.researchContextGateway.list();

            if (!dto.success) {
                this.presenter.presentError({
                    status: "error",
                    message: dto.data.message,
                    operation: "usecase#list-research-context",
                });
                return;
            }
        
            const researchContextList = dto.data;
        
            const successResponse: TListResearchContextsResponse = {
                status: "success",
                researchContexts: researchContextList,
            };
        
            this.presenter.presentSuccess(successResponse);
        } catch (error) {
            const err = error as Error;
        
            this.presenter.presentError({
                status: "error",
                message: err.message,
                operation: "usecase#list-research-context",
            });
        }
    }
}