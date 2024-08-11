import type { TCreateResearchContextDTO, TGetResearchContextDTO, TListResearchContextDTO } from "../../dto/research-context-repository-dto";
import type { TResearchContext } from "../../entity/kernel-models";

export default interface ResearchContextRepositoryOutputPort {
    list(clientID: string): Promise<TListResearchContextDTO>;
    get(clientID: string, researchContextID: string): Promise<TGetResearchContextDTO>;
    create(clientID: string, researchContext: TResearchContext): Promise<TCreateResearchContextDTO>;
}