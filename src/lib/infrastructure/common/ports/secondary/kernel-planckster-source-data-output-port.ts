import type SourceDataGatewayOutputPort from "~/lib/core/ports/secondary/source-data-gateway-output-port";
import { type GetClientDataForDownloadDTO, type GetClientDataForUploadDTO, type NewSourceDataDTO } from "../../dto/kernel-planckster-source-data-gateway-dto";

export default interface KernelPlancksterSourceDataOutputPort extends SourceDataGatewayOutputPort {
  getClientDataForUpload(relativePath: string): Promise<GetClientDataForUploadDTO>;

  getClientDataForDownload(relativePath: string): Promise<GetClientDataForDownloadDTO>;

  newSourceData(sourceDataName: string, relativePath: string): Promise<NewSourceDataDTO>;
}
