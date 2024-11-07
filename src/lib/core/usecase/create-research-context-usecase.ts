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
    const { title, description, sourceDataList } = request;

    // 1. Create vector store with the Source Data
    const createVectorStoreDTO = await this.vectorStore.createVectorStore(sourceDataList);

    if (!createVectorStoreDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#create-research-context",
        message: "Failed to create vector store for the provided files. Check again later.",
        context: createVectorStoreDTO,
      });
      return;
    }
    const vectorStoreID = createVectorStoreDTO.data.id;
    this.presenter.presentProgress({
      status: "vector-store-created",
      message: "Vector store created. Registering agents...",
      context: createVectorStoreDTO,
    });

    // 2. Create an agent, linking it to the vector store
    const createAgentDTO = await this.agentGateway.createAgent(title, description, vectorStoreID);
    if (!createAgentDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#create-research-context",
        message: "Failed to create an agent. Check again later.",
        context: createAgentDTO,
      });
      return;
    }
    this.presenter.presentProgress({
      status: "agent-created",
      message: "Agent created. Registering research context...",
      context: createAgentDTO,
    });

    const externalID = createAgentDTO.data.externalID;

    // 3. Create the research context, linking it to the agent
    const createResearchContextDTO = await this.researchContextsGateway.create(externalID, title, description, sourceDataList);
    if (!createResearchContextDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#create-research-context",
        message: createResearchContextDTO.data.message,
        context: createResearchContextDTO.data,
      });
      return;
    }

    this.presenter.presentSuccess({
      status: "success",
      researchContext: createResearchContextDTO.data,
      message: "Research context created successfully.",
      context: {},
    });
  }
}
