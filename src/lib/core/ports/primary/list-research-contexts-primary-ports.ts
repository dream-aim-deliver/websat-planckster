/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import { type TListResearchContextsRequest, type TListResearchContextsSuccessResponse, type TListResearchContextsErrorResponse } from "../../usecase-models/list-research-contexts-usecase-models";
import { type TListResearchContextsViewModel } from "../../view-models/list-research-contexts-view-models";

export interface ListResearchContextsInputPort {
    presenter: ListResearchContextsOutputPort;
    execute(request: TListResearchContextsRequest): Promise<void>;
}

export interface ListResearchContextsOutputPort {
    response: Signal<TListResearchContextsViewModel>;
    presentSuccess(usecaseSuccessResponse: TListResearchContextsSuccessResponse): Promise<void>;
    presentError(usecaseErrorResponse: TListResearchContextsErrorResponse): Promise<void>;
}