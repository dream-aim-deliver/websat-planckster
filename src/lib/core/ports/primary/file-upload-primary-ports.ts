/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import type { TFileUploadErrorResponse, TFileUploadProgressResponse, TFileUploadRequest, TFileUploadSuccessResponse } from "../../usecase-models/file-upload-usecase-models";
import { type TFileUploadViewModel } from "../../view-models/file-upload-view-model";

export interface FileUploadInputPort {
  execute(request: TFileUploadRequest): Promise<void>;
}

export interface FileUploadOutputPort {
  response: Signal<TFileUploadViewModel>;
  presentProgress(usecaseProgressResponse: TFileUploadProgressResponse): Promise<void>;
  presentSuccess(usecaseSuccessResponse: TFileUploadSuccessResponse): Promise<void>;
  presentError(error: TFileUploadErrorResponse): Promise<void>;
}
