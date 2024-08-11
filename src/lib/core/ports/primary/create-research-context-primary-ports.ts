import type { TCreateResearchContextErrorResponse, TCreateResearchContextProgressResponse, TCreateResearchContextRequest, TCreateResearchContextSuccessResponse } from "../../usecase-models/create-research-context-usecase-models";

export interface CreateResearchContextInputPort {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    presenter: CreateResearchContextOutputPort<any>;
    execute(request: TCreateResearchContextRequest): Promise<void>;
}

export interface CreateResearchContextOutputPort<TResponse> {
    response: TResponse;
    presentProgress(progress: TCreateResearchContextProgressResponse): void;
    presentSuccess(success: TCreateResearchContextSuccessResponse): void;
    presentError(error: TCreateResearchContextErrorResponse): void;
}