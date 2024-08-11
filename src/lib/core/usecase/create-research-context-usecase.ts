/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CreateResearchContextInputPort, CreateResearchContextOutputPort } from "../ports/primary/create-research-context-primary-ports";
import type { TCreateResearchContextRequest } from "../usecase-models/create-research-context-usecase-models";

export default class CreateResearchContextUsecase implements CreateResearchContextInputPort {
    presenter: CreateResearchContextOutputPort<any>;
    constructor(presenter: CreateResearchContextOutputPort<any>) {
        this.presenter = presenter;
    }

    async execute(request: TCreateResearchContextRequest): Promise<void> {
        throw new Error("Method not implemented.");
        // TODO : ResearchContextRepository.create(request)
        // VectorRepository.create(request)
        // VectorRepository.uploadFiles(request) download from kernel and upload files to vector store server
        /// VectorRepository.createEmbedding(request)
        // AgentRepository.create(request)
    }
}