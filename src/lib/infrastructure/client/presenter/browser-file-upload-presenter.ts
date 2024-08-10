import { type TSignal } from "../../../core/entity/signals";
import { type FileUploadOutputPort } from "../../../core/ports/primary/file-upload-primary-ports";
import { type TFileUploadProgressResponse } from "../../../core/usecase-models/file-upload-usecase-models";
import { type TFileUploadingViewModel } from "../../../core/view-models/file-upload-view-model";

export default class BrowserFileUploadPresenter implements FileUploadOutputPort<TSignal<TFileUploadingViewModel>>{
    response: TSignal<TFileUploadingViewModel>;
    constructor(response: TSignal<TFileUploadingViewModel>) {
        this.response = response;
    }

    presentProgress(progress: TFileUploadProgressResponse): void {
        this.response.update({
            status: "progress",
            message: progress.message,
            progress: progress.progress
        });
    }

    presentError(error: { message: string }): void {
        this.response.update({
            status: "error",
            message: error.message
        })
    }

    presentSuccess(success: { message: string; fileName: string }): void {
        this.response.update({
            status: "success",
            message: success.message,
            fileName: success.fileName
        })
    }

}