import { TListResearchContextsRequest, TListResearchContextsSuccessResponse, TListResearchContextsErrorResponse } from "../../usecase-models/list-research-contexts-usecase-models";

export interface ListResearchContextsPrimaryPorts {
    execute(request: TListResearchContextsRequest): Promise<void>;
    presenter: ListResearchContextsOutputPort<any>;
}

export interface ListResearchContextsOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(response: TListResearchContextsSuccessResponse): void;
    presentError(response: TListResearchContextsErrorResponse): void;
}