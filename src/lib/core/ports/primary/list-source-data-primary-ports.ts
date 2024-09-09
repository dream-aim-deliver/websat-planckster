/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListSourceDataErrorResponse, type TListSourceDataRequest, type TListSourceDataSuccessResponse } from "../../usecase-models/list-source-data-usecase-models";

export interface ListSourceDataInputPort {
    presenter: ListSourceDataOutputPort<any>;
    execute(request: TListSourceDataRequest): Promise<void>;
}

export interface ListSourceDataOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(success: TListSourceDataSuccessResponse): void;
    presentError(error: TListSourceDataErrorResponse): void;
}