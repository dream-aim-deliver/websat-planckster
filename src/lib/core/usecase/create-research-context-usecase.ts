/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CreateResearchContextInputPort, CreateResearchContextOutputPort } from "../ports/primary/create-research-context-primary-ports";
import type AgentGatewayOutputPort from "../ports/secondary/agent-gateway-output-port";
import type ResearchContextGatewayOutputPort from "../ports/secondary/research-context-gateway-output-port";
import type VectorStoreOutputPort from "../ports/secondary/vector-store-output-port";
import type { TCreateResearchContextRequest } from "../usecase-models/create-research-context-usecase-models";

export default class CreateResearchContextUsecase implements CreateResearchContextInputPort {
    presenter: CreateResearchContextOutputPort<any>;
    researchContextsGateway: ResearchContextGatewayOutputPort;
    agentGateway: AgentGatewayOutputPort<any>;
    vectorStore: VectorStoreOutputPort;
    constructor(presenter: CreateResearchContextOutputPort<any>, researchContextsGateway: ResearchContextGatewayOutputPort, agentGateway: AgentGatewayOutputPort<any>, vectorStore: VectorStoreOutputPort) {
        this.presenter = presenter;
        this.researchContextsGateway = researchContextsGateway;
        this.agentGateway = agentGateway;
        this.vectorStore = vectorStore;
    }

    async execute(request: TCreateResearchContextRequest): Promise<void> {
        // throw new Error("Method not implemented.");
        // TODO : ResearchContextRepository.create(request)
        const createResearchContextDTO = await this.researchContextsGateway.create(request.title, request.description, request.sourceDataList)
        if (!createResearchContextDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#create-research-context",
                    message: "Oops! Could not register the research context.",
                    context: createResearchContextDTO
                }
            )
            return;
        }
        const researchContextID = createResearchContextDTO.data.id

        this.presenter.presentProgress({
            status: "research-context-created-in-backend",
            message: `Registered a research context titled ${request.title}. Creating vector store...`,
            context: createResearchContextDTO
        })

        const createVectorStoreDTO = await this.vectorStore.createVectorStore(researchContextID, request.sourceDataList);

        if (!createVectorStoreDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#create-research-context",
                    message: "Failed to create vector store for the provided files. Check again later.",
                    context: createVectorStoreDTO
                }
            )
            return;
        }

        this.presenter.presentProgress({
            status: "vector-store-created",
            message: "Vector store created. Registering agents...",
            context: createVectorStoreDTO
        })

        const createAgentDTO = await this.agentGateway.createAgent(researchContextID);
        if (!createAgentDTO.success) {
            this.presenter.presentError(
                {
                    operation: "usecase#create-research-context",
                    message: "Failed to create an agent. Check again later.",
                    context: createAgentDTO
                }
            )
            return;
        }

        this.presenter.presentSuccess({
            researchContext: createResearchContextDTO.data,
        })
    }
}