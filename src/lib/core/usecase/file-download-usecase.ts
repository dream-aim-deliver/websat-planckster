import { type RemoteFile } from "../entity/file";
import { type FileDownloadInputPort, type FileDownloadOutputPort } from "../ports/primary/file-download-primary-ports";
import type SourceDataGatewayOutputPort from "../ports/secondary/source-data-gateway-output-port";
import { type TFileDownloadRequest, type TFileDownloadResponse } from "../usecase-models/file-download-usecase-models";

export default class BrowserFileDownloadUsecase implements FileDownloadInputPort {
  presenter: FileDownloadOutputPort;
  sourceDataGateway: SourceDataGatewayOutputPort;

  constructor(presenter: FileDownloadOutputPort, sourceDataGateway: SourceDataGatewayOutputPort) {
    this.presenter = presenter;
    this.sourceDataGateway = sourceDataGateway;
  }

  async execute(request: TFileDownloadRequest): Promise<void> {
    try {
      const { relativePath, localPath } = request;

      const remoteFile: RemoteFile = {
        relativePath: relativePath,
        type: "remote",
        id: "",
        name: "",
        provider: "",
        createdAt: "",
      };

      const dto = await this.sourceDataGateway.download(remoteFile, localPath);

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          operation: "usecase#browser-fileDownload",
          message: dto.data.message,
          context: {
            remoteFile: remoteFile,
          },
        });
        return;
      }

      const successResponse: TFileDownloadResponse = {
        status: "success",
        message: `Successfully downloaded file: ${dto.data.relativePath}`,
      };

      await this.presenter.presentSuccess(successResponse);
    } catch (error) {
      const err = error as Error;

      await this.presenter.presentError({
        status: "error",
        message: err.message ?? "An error occurred while downloading file",
        operation: "usecase#browser-fileDownload",
        context: {
          error: error,
        },
      });
    }
  }
}
