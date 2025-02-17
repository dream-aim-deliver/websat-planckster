/* eslint-disable @typescript-eslint/no-explicit-any */
import { type TCaseStudyMetadataWithoutRelativePaths } from "../entity/case-study-models";
import { type RemoteFile } from "../entity/file";
import { type TConversation, type TResearchContext } from "../entity/kernel-models";
import { type CaseStudyInputPort, type CaseStudyOutputPort } from "../ports/primary/case-study-primary-ports";
import type AgentGatewayOutputPort from "../ports/secondary/agent-gateway-output-port";
import type CaseStudyRepositoryOutputPort from "../ports/secondary/case-study-repository-output-port";
import type ConversationGatewayOutputPort from "../ports/secondary/conversation-gateway-output-port";
import type ResearchContextGatewayOutputPort from "../ports/secondary/research-context-gateway-output-port";
import type SourceDataGatewayOutputPort from "../ports/secondary/source-data-gateway-output-port";
import type VectorStoreOutputPort from "../ports/secondary/vector-store-output-port";
import { type TCaseStudyRequest } from "../usecase-models/case-study-usecase-models";

export default class BrowserCaseStudyUsecase implements CaseStudyInputPort {
  presenter: CaseStudyOutputPort;
  researchContextGateway: ResearchContextGatewayOutputPort;
  conversationGateway: ConversationGatewayOutputPort;
  agentGateway: AgentGatewayOutputPort<any>;
  vectorStore: VectorStoreOutputPort;
  sourceDataGateway: SourceDataGatewayOutputPort;
  caseStudyRepository: CaseStudyRepositoryOutputPort;
  constructor(
    presenter: CaseStudyOutputPort,
    researchContextsGateway: ResearchContextGatewayOutputPort,
    conversationGateway: ConversationGatewayOutputPort,
    agentGateway: AgentGatewayOutputPort<any>,
    vectorStore: VectorStoreOutputPort,
    sourceDataGateway: SourceDataGatewayOutputPort,
    caseStudyRepository: CaseStudyRepositoryOutputPort,
  ) {
    this.presenter = presenter;
    this.researchContextGateway = researchContextsGateway;
    this.conversationGateway = conversationGateway;
    this.agentGateway = agentGateway;
    this.vectorStore = vectorStore;
    this.sourceDataGateway = sourceDataGateway;
    this.caseStudyRepository = caseStudyRepository;
  }

  async execute(request: TCaseStudyRequest): Promise<void> {
    const { caseStudyName, tracerID, jobID } = request;

    const supportedCaseStudies = ["climate-monitoring", "sentinel-5p", "swissgrid"];

    // Ensure that the case study name is one of the two we support
    if (!supportedCaseStudies.includes(caseStudyName)) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Case study name not recognized.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    const researchContextTitle = `${caseStudyName}_${tracerID}_${jobID}`;

    // 1. List all research contexts
    const listResearchContextDTO = await this.researchContextGateway.list();

    if (!listResearchContextDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Failed listing the research contexts.",
        context: {
          tracerID,
          jobID,
        },
      });
      return;
    }

    this.presenter.presentProgress({
      status: "progress",
      message: "Research contexts listed. Searching for the case study...",
      context: listResearchContextDTO,
    });

    // 2. Find the one that matches the name
    const filteredRCs = listResearchContextDTO.data.filter((rc) => rc.title === researchContextTitle);

    if (filteredRCs.length > 1) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "More than one Research Context found for case study, tracer ID and job ID.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    let foundRC: TResearchContext | null = null;
    // 3. If found, put it aside to return after we've gotten the map files
    if (filteredRCs.length === 1 && filteredRCs[0]) {
      if (filteredRCs[0].status === "active") {
        foundRC = filteredRCs[0];
        this.presenter.presentProgress({
          status: "progress",
          message: "Research Context found and active. Continuing...",
          context: {
            caseStudyName,
            tracerID,
            jobID,
          },
        });
      } else {
        this.presenter.presentError({
          status: "error",
          operation: "usecase#case-study",
          message: "Research Context found but not active.",
          context: {
            caseStudyName,
            tracerID,
            jobID,
          },
        });
        return;
      }
    } else if (filteredRCs.length === 1 && !filteredRCs[0]) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Research Context found but not present.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    // 4. Similar logic with conversation, if we found a Research Context
    let foundConversation: TConversation | null = null;
    if (foundRC) {
      const listConversationsDTO = await this.conversationGateway.listConversations(foundRC.id);

      if (!listConversationsDTO.success) {
        this.presenter.presentError({
          status: "error",
          operation: "usecase#case-study",
          message: listConversationsDTO.data.message,
          context: {
            caseStudyName,
            tracerID,
            jobID,
          },
        });
        return;
      }

      this.presenter.presentProgress({
        status: "progress",
        message: "Conversations listed. Searching for the case study...",
        context: listConversationsDTO,
      });

      const filteredConversations: TConversation[] = listConversationsDTO.data.filter((conv) => conv.title === researchContextTitle);

      // NOTE: in this case, picking just the last one
      if (filteredConversations.length > 0) {
        foundConversation = filteredConversations[filteredConversations.length - 1]!;
        this.presenter.presentProgress({
          status: "progress",
          message: "Conversation found. Continuing...",
          context: {
            caseStudyName,
            tracerID,
            jobID,
          },
        });
      }
    }

    this.presenter.presentProgress({
      status: "progress",
      message: "Preparing metadata and source data...",
      context: {
        caseStudyName,
        tracerID,
        jobID,
      },
    });

    // 4. Parse case study metadata to get the segregated source data relative paths
    const caseStudyMetadataDTO = await this.caseStudyRepository.getCaseStudyMetadata(caseStudyName, tracerID, jobID);

    if (!caseStudyMetadataDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: caseStudyMetadataDTO.data.message,
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    const { caseStudy, keyframes, expirationTime, relativePathsForAgent, imageKinds } = caseStudyMetadataDTO.data;

    if (caseStudy !== caseStudyName) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Case study name does not match the metadata's.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    if (relativePathsForAgent.length === 0) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "No source data found for the agent in the metadata.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    const metadata = {
      caseStudy,
      keyframes: keyframes,
      imageKinds: imageKinds,
      expirationTime,
    } as TCaseStudyMetadataWithoutRelativePaths;

    // 5. Prepare the agent source data
    // If the Research Context was found already, we return it with a conversation
    if (foundRC) {
      if (foundConversation) {
        this.presenter.presentSuccess({
          status: "success",
          metadata: metadata,
          researchContext: foundRC,
          conversation: foundConversation,
        });
        return;
      } else {
        // create a new conversation
        this.presenter.presentProgress({
          status: "progress",
          message: "Creating a new conversation...",
          context: {
            caseStudyName,
            tracerID,
            jobID,
          },
        });

        const createConversationDTO = await this.conversationGateway.createConversation(foundRC.id, researchContextTitle);

        if (!createConversationDTO.success) {
          this.presenter.presentError({
            status: "error",
            operation: "usecase#case-study",
            message: createConversationDTO.data.message,
            context: {
              caseStudyName,
              tracerID,
              jobID,
            },
          });
          return;
        }

        this.presenter.presentSuccess({
          status: "success",
          metadata: metadata,
          researchContext: foundRC,
          conversation: createConversationDTO.data,
        });
        return;
      }
    }

    // Else, we continue to create a new Research Context
    this.presenter.presentProgress({
      status: "progress",
      message: " Preparing agent source data...",
      context: {
        caseStudyName,
        tracerID,
        jobID,
      },
    });

    // 5.2 List all source data and filter the ones that are for the agent, using the relative paths
    const listSourceDataDTO = await this.sourceDataGateway.listSourceDataForClient();

    if (!listSourceDataDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: listSourceDataDTO.data.message,
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    const agentRemoteFiles: RemoteFile[] = [];
    for (const sourceData of listSourceDataDTO.data) {
      if (relativePathsForAgent.includes(sourceData.relativePath) && sourceData.type === "remote") {
        agentRemoteFiles.push(sourceData);
      }
    }

    this.presenter.presentProgress({
      status: "progress",
      message: "Source data prepared. Creating vector store...",
      context: {
        caseStudyName,
        tracerID,
        jobID,
      },
    });

    // 6. Create a new VectorStore with (C), then create a new Agent as usual
    const createVectorStoreDTO = await this.vectorStore.createVectorStore(agentRemoteFiles);

    if (!createVectorStoreDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Failed to create vector store for the provided files. Check again later.",
        context: createVectorStoreDTO,
      });
      return;
    }

    const vectorStoreID = createVectorStoreDTO.data.id;
    const nonVectorStoreFiles = createVectorStoreDTO.data.unsupportedFiles;

    this.presenter.presentProgress({
      status: "progress",
      message: "Vector store created. Creating agent...",
      context: createVectorStoreDTO,
    });

    const researchContextDescripttion = `This Research Context was created for the case study ${caseStudyName}, with tracer ID ${tracerID} and job ID ${jobID}. It contains source data that complements the map that the users see next to the conversation with the agent.`;

    const agentSystemInstructions = `You are a research assistant for the case study with name '${caseStudyName}'. You have been provided, through a vector store, with data that complements the map that users see next to the conversation with you. This data is meant to help you understand the context of the conversation better, and to provide more accurate and relevant responses to the queries. The source of this data is different scrapers that have parsed different APIs relevant to the case study in question. So, when asked about any file that you should have access to, please consider that it may be in the vector store.`;

    const createAgentDTO = await this.agentGateway.createAgent(researchContextTitle, researchContextDescripttion, vectorStoreID, nonVectorStoreFiles, agentSystemInstructions);

    if (!createAgentDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Failed to create an agent. Check again later.",
        context: createAgentDTO,
      });
      return;
    }
    const externalID = createAgentDTO.data.externalID;

    this.presenter.presentProgress({
      status: "progress",
      message: "Agent created. Creating research context...",
      context: createAgentDTO,
    });

    // 7. Create a new ResearchContext linking it to the Agent
    const createResearchContextDTO = await this.researchContextGateway.create(externalID, researchContextTitle, researchContextDescripttion, agentRemoteFiles);

    if (!createResearchContextDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: createResearchContextDTO.data.message,
        context: createResearchContextDTO.data,
      });
      return;
    }

    this.presenter.presentProgress({
      status: "progress",
      message: "Research context created. Creating conversation...",
      context: createResearchContextDTO,
    });

    // 8. Create a new conversation
    const createConversationDTO = await this.conversationGateway.createConversation(createResearchContextDTO.data.id, researchContextTitle);

    if (!createConversationDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: createConversationDTO.data.message,
        context: createConversationDTO.data,
      });
      return;
    }

    // 9. Return the Research Context and the map files
    this.presenter.presentSuccess({
      status: "success",
      metadata: metadata,
      researchContext: createResearchContextDTO.data,
      conversation: createConversationDTO.data,
    });
  }
}
