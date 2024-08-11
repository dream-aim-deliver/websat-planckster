import type { TListResearchContextDTO, TGetResearchContextDTO, TCreateResearchContextDTO } from "~/lib/core/dto/research-context-repository-dto";
import type { TResearchContext } from "~/lib/core/entity/kernel-models";
import type ResearchContextRepositoryOutputPort from "~/lib/core/ports/secondary/research-context-repository-output-port";

export default class BrowserResearchContextRepository implements ResearchContextRepositoryOutputPort {
    list(clientID: string): Promise<TListResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
    async get(clientID: string, researchContextID: string): Promise<TGetResearchContextDTO> {
        
        return {
            success: false,
            data: {
                operation: "browser-research-context-repository#get",
                message: "Method not implemented."
            }
        }
    }
    create(clientID: string, researchContext: TResearchContext): Promise<TCreateResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
}