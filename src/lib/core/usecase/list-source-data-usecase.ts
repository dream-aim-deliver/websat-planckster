import { type ListSourceDataDTO } from "../dto/source-data-gateway-dto";
import { type ListSourceDataOutputPort, type ListSourceDataInputPort } from "../ports/primary/list-source-data-primary-ports";
import type SourceDataGatewayOutputPort from "../ports/secondary/source-data-gateway-output-port";
import { type TListSourceDataRequest, type TListSourceDataResponse } from "../usecase-models/list-source-data-usecase-models";

export default class ListSourceDataUsecase implements ListSourceDataInputPort {
  presenter: ListSourceDataOutputPort;
  sourceDataGateway: SourceDataGatewayOutputPort;

  constructor(presenter: ListSourceDataOutputPort, sourceDataGateway: SourceDataGatewayOutputPort) {
    this.presenter = presenter;
    this.sourceDataGateway = sourceDataGateway;
  }

  async execute(request: TListSourceDataRequest): Promise<void> {
    try {
      const { researchContextID } = request;

      let dto: ListSourceDataDTO;

      if (!researchContextID) {
        dto = await this.sourceDataGateway.listSourceDataForClient();
      } else {
        dto = await this.sourceDataGateway.listSourceDataForResearchContext(researchContextID);
      }

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          message: dto.data.message,
          operation: "usecase#list-source-data",
          context: {
            researchContextID: researchContextID,
          },
        });
        return;
      }

      // NOTE: Need to parse the DTO data to get what we need for the view model
      // if something in the gateway changes, this will need to be updated
      const fileList = dto.data;

      const remoteFileList = fileList.filter((file): file is { type: "remote"; id: string; name: string; relativePath: string; provider: string; createdAt: string } => file.type === "remote");

      const successResponse: TListSourceDataResponse = {
        status: "success",
        sourceData: remoteFileList,
      };

      await this.presenter.presentSuccess(successResponse);
    } catch (error) {
      const err = error as Error;

      await this.presenter.presentError({
        status: "error",
        message: err.message,
        operation: "usecase#list-source-data",
        context: {
          researchContextId: request.researchContextID,
        },
      });
    }
  }
}
