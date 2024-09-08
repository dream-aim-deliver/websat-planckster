/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import type { TListSourceDataErrorResponse, TListSourceDataRequest, TListSourceDataSuccessResponse } from "../../usecase-models/list-source-data-usecase-models";
import { type TListSourceDataViewModel } from "../../view-models/list-source-data-view-models";

export interface ListSourceDataInputPort {
  execute(request: TListSourceDataRequest): Promise<void>;
}

export interface ListSourceDataOutputPort {
  response: Signal<TListSourceDataViewModel>;
  presentSuccess(usecaseSuccessResponse: TListSourceDataSuccessResponse): Promise<void>;
  presentError(usecaseErrorResponse: TListSourceDataErrorResponse): Promise<void>;
}
