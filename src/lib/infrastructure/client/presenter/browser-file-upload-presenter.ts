/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ILogObj, type Logger } from "tslog";
import { type Signal } from "../../../core/entity/signals";
import { type FileUploadOutputPort } from "../../../core/ports/primary/file-upload-primary-ports";
import { type TFileUploadErrorResponse, type TFileUploadSuccessResponse, type TFileUploadProgressResponse } from "../../../core/usecase-models/file-upload-usecase-models";
import { type TFileUploadViewModel } from "../../../core/view-models/file-upload-view-model";

export default class BrowserFileUploadPresenter implements FileUploadOutputPort {
  logger: Logger<ILogObj>;
  response: Signal<TFileUploadViewModel>;
  constructor(response: Signal<TFileUploadViewModel>, loggerFactory: (module: string) => Logger<ILogObj>) {
    this.response = response;
    this.logger = loggerFactory("BrowserFileUploadPresenter");
  }

  async presentProgress(usecaseProgressResponse: TFileUploadProgressResponse): Promise<void> {
    this.logger.info({ usecaseProgressResponse }, `File upload progress: ${usecaseProgressResponse.progress}`);
    this.response.update({
      status: "progress",
      message: usecaseProgressResponse.message,
      progress: usecaseProgressResponse.progress,
    });
  }

  async presentError(usecaseErrorResponse: TFileUploadErrorResponse): Promise<void> {
    this.logger.error({ usecaseErrorResponse }, `Failed to upload file: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }

  async presentSuccess(usecaseSuccessResponse: TFileUploadSuccessResponse): Promise<void> {
    this.logger.debug({ usecaseSuccessResponse }, `Successfully uploaded file: ${usecaseSuccessResponse.fileName}`);
    this.response.update({
      status: "success",
      message: usecaseSuccessResponse.message,
      fileName: usecaseSuccessResponse.fileName,
    });
  }
}
