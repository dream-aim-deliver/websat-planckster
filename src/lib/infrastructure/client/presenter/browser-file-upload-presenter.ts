/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Signal } from "../../../core/entity/signals";
import { type FileUploadOutputPort } from "../../../core/ports/primary/file-upload-primary-ports";
import { type TFileUploadErrorResponse, type TFileUploadSuccessResponse, type TFileUploadProgressResponse } from "../../../core/usecase-models/file-upload-usecase-models";
import { type TFileUploadingViewModel } from "../../../core/view-models/file-upload-view-model";

export default class BrowserFileUploadPresenter implements FileUploadOutputPort<Signal<TFileUploadingViewModel>>{
    response: Signal<TFileUploadingViewModel>;
    constructor(response: Signal<TFileUploadingViewModel>) {
        this.response = response;
    }

    presentProgress(progress: TFileUploadProgressResponse): void {
        this.response.update({
            status: "progress",
            message: progress.message,
            progress: progress.progress
        });
    }

    presentError(error: TFileUploadErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context
        })
    }

    presentSuccess(success: TFileUploadSuccessResponse): void {
        this.response.update({
            status: "success",
            message: success.message,
            fileName: success.fileName
        })
    }

}