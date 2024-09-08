/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal } from "../../entity/signals";
import { type TFileDownloadPartialResponse, type TFileDownloadErrorResponse, type TFileDownloadProgressResponse, type TFileDownloadRequest, type TFileDownloadSuccessResponse } from "../../usecase-models/file-download-usecase-models";
import { type TFileDownloadViewModel } from "../../view-models/file-download-view-model";

export interface FileDownloadInputPort {
  presenter: FileDownloadOutputPort;
  execute(request: TFileDownloadRequest): Promise<void>;
}

export interface FileDownloadOutputPort {
  response: Signal<TFileDownloadViewModel>;
  presentProgress(usecaseProgressResponse: TFileDownloadProgressResponse): Promise<void>;
  presentPartial(usecasePartialResponse: TFileDownloadPartialResponse): Promise<void>;
  presentSuccess(usecaseSuccessResponse: TFileDownloadSuccessResponse): Promise<void>;
  presentError(usecaseErrorResponse: TFileDownloadErrorResponse): Promise<void>;
}
