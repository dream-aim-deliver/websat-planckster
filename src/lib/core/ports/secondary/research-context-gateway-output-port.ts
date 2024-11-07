import type { TCreateResearchContextDTO, TGetResearchContextDTO, TListResearchContextDTO } from "../../dto/research-context-gateway-dto";
import { type RemoteFile } from "../../entity/file";

export default interface ResearchContextGatewayOutputPort {
  list(): Promise<TListResearchContextDTO>;
  get(researchContextID: string): Promise<TGetResearchContextDTO>;
  create(researchContextExternalID: string, researchContextTitle: string, researchContextDescription: string, sourceData: RemoteFile[]): Promise<TCreateResearchContextDTO>;
}
