import { TListResearchContextDTO, TGetResearchContextDTO, TCreateResearchContextDTO } from "~/lib/core/dto/research-context-gateway-dto";
import ResearchContextGatewayOutputPort from "~/lib/core/ports/secondary/research-context-gateway-output-port";
import { File, RemoteFile } from "~/lib/core/entity/file";
import { injectable } from "inversify";

@injectable()
export default class BrowserResearchContextGateway implements ResearchContextGatewayOutputPort {
    list(): Promise<TListResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
    get(researchContextID: string): Promise<TGetResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
    create(researchContextName: string, researchContextDescription: string, sourceData: RemoteFile[]): Promise<TCreateResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
   

}