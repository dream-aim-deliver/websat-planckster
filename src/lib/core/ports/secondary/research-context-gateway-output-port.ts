import type { TCreateResearchContextDTO, TGetResearchContextDTO, TListResearchContextDTO } from "../../dto/research-context-gateway-dto";
import { type RemoteFile } from "../../entity/file";

export default interface ResearchContextGatewayOutputPort {
    list(): Promise<TListResearchContextDTO>;
    get(researchContextID: string): Promise<TGetResearchContextDTO>;
    create(researchContextName: string, researchContextDescription: string, sourceData: RemoteFile[]): Promise<TCreateResearchContextDTO>;
}