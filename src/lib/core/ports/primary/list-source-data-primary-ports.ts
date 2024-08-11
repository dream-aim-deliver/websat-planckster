/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListSourceDataErrorResponse, type TListSourceDataRequest, type TListSourceDataSuccessResponse } from "../../usecase-models/list-source-data-view-models";

export interface ListSourceDataInputPort {
    presenter: ListSourceDataOutputPort<any>;
    execute(request: TListSourceDataRequest): Promise<void>;
}

export interface ListSourceDataOutputPort<TResponse> {
    response: TResponse;
    presentSuccess(response: TListSourceDataSuccessResponse): void;
    presentError(response: TListSourceDataErrorResponse): void;
}