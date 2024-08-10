import { type TFileDownloadPartialResponse, type TFileDownloadErrorResponse, type TFileDownloadProgressResponse, type TFileDownloadRequest, type TFileDownloadSuccessResponse } from "../../usecase-models/file-download-usecase-models";

export interface FileDownloadOutputPort<TResponse> {
    response: TResponse;
    presentProgress(progress: TFileDownloadProgressResponse): void;
    presentPartial(response: TFileDownloadPartialResponse): void;
    presentSuccess(response: TFileDownloadSuccessResponse): void;
    presentError(error: TFileDownloadErrorResponse): void;

}

export interface FileDownloadInputPort {
    presenter: FileDownloadOutputPort<unknown>;
    execute(request: TFileDownloadRequest): Promise<void>;
}