import { type TFileUploadErrorResponse, type TFileUploadProgressResponse, type TFileUploadRequest, type TFileUploadSuccessResponse } from "../../usecase-models/file-upload-usecase-models";

export interface FileUploadOutputPort<TResponse> {
    response: TResponse;
    presentProgress(progress: TFileUploadProgressResponse): void;
    presentSuccess(response: TFileUploadSuccessResponse): void;
    presentError(error: TFileUploadErrorResponse): void;
}


export interface FileUploadInputPort {
    presenter: FileUploadOutputPort<unknown>;
    execute(request: TFileUploadRequest): Promise<void>;
}