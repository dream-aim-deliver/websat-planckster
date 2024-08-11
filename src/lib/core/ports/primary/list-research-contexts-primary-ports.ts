/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListResearchContextsRequest, type TListResearchContextsSuccessResponse, type TListResearchContextsErrorResponse } from "../../usecase-models/list-research-contexts-usecase-models";

export interface ListResearchContextsPrimaryPorts {
    execute(request: TListResearchContextsRequest): Promise<void>;
    presenter: ListResearchContextsOutputPort<any>;
}

export interface ListResearchContextsOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(success: TListResearchContextsSuccessResponse): void;
    presentError(error: TListResearchContextsErrorResponse): void;
}