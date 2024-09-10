import { type TListResearchContextDTO } from "../dto/research-context-gateway-dto";
import { type ListResearchContextsInputPort, type ListResearchContextsOutputPort } from "../ports/primary/list-research-contexts-primary-ports";
import type ResearchContextGatewayOutputPort from "../ports/secondary/research-context-gateway-output-port";
import { type TListResearchContextsRequest, TListResearchContextsResponse, type TListResearchContextsSuccessResponse } from "../usecase-models/list-research-contexts-usecase-models";

export default class ListResearchContextsUsecase implements ListResearchContextsInputPort {
  presenter: ListResearchContextsOutputPort;
  researchContextGateway: ResearchContextGatewayOutputPort;

  constructor(presenter: ListResearchContextsOutputPort, researchContextGateway: ResearchContextGatewayOutputPort) {
    this.presenter = presenter;
    this.researchContextGateway = researchContextGateway;
  }

  async execute(request: TListResearchContextsRequest): Promise<void> {
    try {
      const dto: TListResearchContextDTO = await this.researchContextGateway.list();

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          message: dto.data.message,
          operation: "usecase#listResearchContexts",
        });
        return;
      }

      const successResponse: TListResearchContextsSuccessResponse = {
        status: "success",
        researchContexts: dto.data
          .filter((researchContext) => researchContext.success === true)
          .map((researchContext) => ({
            id: researchContext.data.id,
            title: researchContext.data.title,
            description: researchContext.data.description,
          })),
      };

      await this.presenter.presentSuccess(successResponse);
    } catch (error) {
      const err = error as Error;

      await this.presenter.presentError({
        status: "error",
        message: err.message ?? "An error occurred while listing research contexts",
        operation: "usecase#list-research-contexts",
        context: {
          error: error,
        },
      });
    }
  }
}
