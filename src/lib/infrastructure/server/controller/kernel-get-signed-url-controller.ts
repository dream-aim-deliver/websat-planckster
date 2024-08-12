import { injectable } from "inversify";
import serverContainer from "../config/ioc/server-container";
import KernelSourceDataGateway from "../gateway/kernel-source-data-gateway";
import { KERNEL } from "../config/ioc/server-ioc-symbols";
import { TGetSignedURLViewModel } from "../../view-models/get-signed-url-view-model";
import GetSignedUrlPresenter from "../presenter/get-signed-url-presenter";



export interface TGetSignedUrlControllerParameters {
    response: TGetSignedURLViewModel;
    requestType: "upload" | "download";
    relativePath: string;
    protocol: string;
}

@injectable()
export default class GetSignedUrlController {
    async execute(params: TGetSignedUrlControllerParameters): Promise<void> {
        const kernelSourceDataGateway = serverContainer.get<KernelSourceDataGateway>(KERNEL.SOURCE_DATA_GATEWAY);
        const presenter = new GetSignedUrlPresenter(params.response);
        const { requestType, relativePath, protocol } = params;
        if (requestType === "upload") {
            const dto = await kernelSourceDataGateway.getUploadSignedUrl(relativePath, protocol);
            if (!dto.success) {
                presenter.presentError("get-signed-url", dto.data.message);
                return;
            }
            presenter.presentSuccess(dto.data);

        } else if (requestType === "download") {
            const dto = await kernelSourceDataGateway.getDownloadSignedUrl(relativePath, protocol);
            if (!dto.success) {
                presenter.presentError("get-signed-url", dto.data.message);
                return;
            }
            presenter.presentSuccess(dto.data);
        }
    }
}