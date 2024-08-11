import type { TListResearchContextDTO, TGetResearchContextDTO, TCreateResearchContextDTO } from "~/lib/core/dto/research-context-repository-dto";
import type { TResearchContext } from "~/lib/core/entity/kernel-models";
import type ResearchContextRepositoryOutputPort from "~/lib/core/ports/secondary/research-context-repository-output-port";

export default class ResearchContextRepository implements ResearchContextRepositoryOutputPort {
    async list(clientID: string): Promise<TListResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
    async get(clientID: string, researchContextID: string): Promise<TGetResearchContextDTO> {
       throw new Error("Method not implemented.");
    }
    
    async create(clientID: string, researchContext: TResearchContext): Promise<TCreateResearchContextDTO> {
        throw new Error("Method not implemented.");
    }
}