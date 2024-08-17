/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TListSourceDataResponse, type TListSourceDataErrorResponse, type TListSourceDataRequest, type TListSourceDataSuccessResponse } from "../../usecase-models/list-source-data-view-models";
import { type TListSourceDataErrorViewModel, type TListSourceDataSuccessViewModel } from "../../view-models/list-source-data-view-models";

export interface ListSourceDataInputPort {
    execute(request: TListSourceDataRequest): Promise<TListSourceDataResponse>;
}

export interface ListSourceDataOutputPort {
    presentSuccess(success: TListSourceDataSuccessResponse): TListSourceDataSuccessViewModel;
    presentError(error: TListSourceDataErrorResponse): TListSourceDataErrorViewModel;
}