import { type FileUploadInputPort, type FileUploadOutputPort } from "../ports/primary/file-upload-primary-ports";
import type SourceDataGatewayOutputPort from "../ports/secondary/source-data-gateway-output-port";
import { type TFileUploadRequest, type TFileUploadResponse } from "../usecase-models/file-upload-usecase-models";

export default class BrowserFileUploadUsecase implements FileUploadInputPort {
  presenter: FileUploadOutputPort;
  sourceDataGateway: SourceDataGatewayOutputPort;

  constructor(presenter: FileUploadOutputPort, sourceDataGateway: SourceDataGatewayOutputPort) {
    this.presenter = presenter;
    this.sourceDataGateway = sourceDataGateway;
  }

  async execute(request: TFileUploadRequest): Promise<void> {
    try {
      const { file } = request;

      const dto = await this.sourceDataGateway.upload(file, file.relativePath);

      if (!dto.success) {
        await this.presenter.presentError({
          status: "error",
          operation: "usecase#browser-fileUpload",
          message: dto.data.message,
          context: {
            file: file,
          },
        });
        return;
      }

      const successResponse: TFileUploadResponse = {
        status: "success",
        message: `Successfully uploaded file: ${dto.data.relativePath}`,
        fileName: dto.data.name,
      };

      await this.presenter.presentSuccess(successResponse);
    } catch (error) {
      const err = error as Error;

      await this.presenter.presentError({
        status: "error",
        message: err.message ?? "An error occurred while uploading file",
        operation: "usecase#browser-fileUpload",
        context: {
          error: error,
        },
      });
    }
  }
}
