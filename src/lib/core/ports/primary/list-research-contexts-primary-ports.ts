/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signal } from "../../entity/signals";
import { type TListResearchContextsSuccessResponse, type TListResearchContextsErrorResponse } from "../../usecase-models/list-research-contexts-usecase-models";
import { TListResearchContextsViewModel } from "../../view-models/list-research-contexts-view-models";

export interface ListResearchContextsInputPort {
    execute(): Promise<void>;
}

export interface ListResearchContextsOutputPort {
    response: Signal<TListResearchContextsViewModel>;
    presentSuccess(success: TListResearchContextsSuccessResponse): void;
    presentError(error: TListResearchContextsErrorResponse): void;
}