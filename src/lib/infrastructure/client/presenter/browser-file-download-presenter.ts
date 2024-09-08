/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ILogObj, type Logger } from "tslog";
import { type Signal } from "../../../core/entity/signals";
import { type FileDownloadOutputPort } from "~/lib/core/ports/primary/file-download-primary-ports";
import { type TFileDownloadPartialResponse, type TFileDownloadErrorResponse, type TFileDownloadProgressResponse, type TFileDownloadSuccessResponse } from "~/lib/core/usecase-models/file-download-usecase-models";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";

export default class BrowserFileDownloadPresenter implements FileDownloadOutputPort {
  logger: Logger<ILogObj>;
  response: Signal<TFileDownloadViewModel>;
  constructor(response: Signal<TFileDownloadViewModel>, loggerFactory: (module: string) => Logger<ILogObj>) {
    this.response = response;
    this.logger = loggerFactory("BrowserFileDownloadPresenter");
  }

  async presentProgress(usecaseProgressResponse: TFileDownloadProgressResponse): Promise<void> {
    this.logger.info({ progress: usecaseProgressResponse }, `File download progress: ${usecaseProgressResponse.progress}`);
    this.response.update({
      status: "progress",
      message: usecaseProgressResponse.message,
      progress: usecaseProgressResponse.progress,
    });
  }

  async presentError(usecaseErrorResponse: TFileDownloadErrorResponse): Promise<void> {
    this.logger.error({ error: usecaseErrorResponse }, `Failed to download file: ${usecaseErrorResponse.message}`);
    this.response.update({
      status: "error",
      message: usecaseErrorResponse.message,
      context: usecaseErrorResponse.context,
    });
  }

  async presentPartial(usecasePartialResponse: TFileDownloadPartialResponse): Promise<void> {
    this.logger.warn({ partial: usecasePartialResponse }, `Partial download: ${usecasePartialResponse.message}`);
    this.response.update({
      status: "partial",
      message: usecasePartialResponse.message,
      unsuccessfullFileNames: usecasePartialResponse.unsuccessfullFileNames,
    });
  }

  async presentSuccess(usecaseSuccessResponse: TFileDownloadSuccessResponse): Promise<void> {
    this.logger.debug({ success: usecaseSuccessResponse }, `Successfully downloaded file: ${usecaseSuccessResponse.message}`);
    this.response.update({
      status: "success",
      message: usecaseSuccessResponse.message,
    });
  }
}
