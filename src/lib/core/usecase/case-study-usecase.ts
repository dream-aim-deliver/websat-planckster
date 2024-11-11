/* eslint-disable @typescript-eslint/no-explicit-any */
import { type RemoteFile } from "../entity/file";
import { type CaseStudyInputPort, type CaseStudyOutputPort } from "../ports/primary/case-study-primary-ports";
import type AgentGatewayOutputPort from "../ports/secondary/agent-gateway-output-port";
import type CaseStudyRepositoryOutputPort from "../ports/secondary/case-study-repository-output-port";
import type ResearchContextGatewayOutputPort from "../ports/secondary/research-context-gateway-output-port";
import type SourceDataGatewayOutputPort from "../ports/secondary/source-data-gateway-output-port";
import type VectorStoreOutputPort from "../ports/secondary/vector-store-output-port";
import { type TCaseStudyRequest } from "../usecase-models/case-study-usecase-models";

export default class CaseStudyUsecase implements CaseStudyInputPort {
  presenter: CaseStudyOutputPort;
  researchContextGateway: ResearchContextGatewayOutputPort;
  agentGateway: AgentGatewayOutputPort<any>;
  vectorStore: VectorStoreOutputPort;
  sourceDataGateway: SourceDataGatewayOutputPort;
  caseStudyRepository: CaseStudyRepositoryOutputPort;
  constructor(
    presenter: CaseStudyOutputPort,
    researchContextsGateway: ResearchContextGatewayOutputPort,
    agentGateway: AgentGatewayOutputPort<any>,
    vectorStore: VectorStoreOutputPort,
    sourceDataGateway: SourceDataGatewayOutputPort,
    caseStudyRepository: CaseStudyRepositoryOutputPort,
  ) {
    this.presenter = presenter;
    this.researchContextGateway = researchContextsGateway;
    this.agentGateway = agentGateway;
    this.vectorStore = vectorStore;
    this.sourceDataGateway = sourceDataGateway;
    this.caseStudyRepository = caseStudyRepository;
  }

  async execute(request: TCaseStudyRequest): Promise<void> {
    const { caseStudyName, tracerID, jobID } = request;

    // for Research Context:
    const researchContextTitle = `${caseStudyName}_${tracerID}_${jobID}`;
    // for Source Data:
    const sourceDataPathStem = `${caseStudyName}/${tracerID}/${jobID}/`;

    // 1. List all research contexts
    const listRCDTO = await this.researchContextGateway.list();

    if (!listRCDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: listRCDTO.data.message,
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
      context: listRCDTO,
    });

    // 2. Find the one that matches the name
    const filteredRCs = listRCDTO.data.filter((rc) => rc.title === researchContextTitle);

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

    let foundRC = null;
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

    this.presenter.presentProgress({
      status: "progress",
      message: "Research Context not found. Preparing source data to create a new one...",
      context: {
        caseStudyName,
        tracerID,
        jobID,
      },
    });

    // 4. Parse case study metadata, and get the map source data and agent source data relative paths
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

    const { mapSourceDataRelativePaths, agentSourceDataRelativePath } = caseStudyMetadataDTO.data;

    // 5. List all SourceData, and...
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

    const allSourceData = listSourceDataDTO.data;

    // 5.1 Look for sourceDataForMap and sourceDataForAgent, if any of those are not found, return an error; then, download the map files to the server and prepare mapLocalFiles to return
    const mapRemoteFiles = allSourceData.filter((sd): sd is RemoteFile => mapSourceDataRelativePaths.includes(sd.relativePath) && sd.type === "remote");

    if (mapRemoteFiles.length !== mapSourceDataRelativePaths.length) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "Not all map source data found.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    } else if (mapRemoteFiles.length === 0) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "No map source data found.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    const mapLocalFilesDTO = await this.caseStudyRepository.downloadMapFiles(mapRemoteFiles);
    if (!mapLocalFilesDTO.success) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: mapLocalFilesDTO.data.message,
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }
    const mapLocalFiles = mapLocalFilesDTO.data;
    if (mapLocalFiles.length === 0) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "No map local files found after triggering download.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    // If the Research Context was found, and we have the map files, we can return the Research Context and the map files
    if (foundRC) {
      this.presenter.presentSuccess({
        status: "success",
        researchContext: foundRC,
        mapLocalFiles,
      });
      return;
    }

    // Else, we continue to create a new Research Context
    this.presenter.presentProgress({
      status: "progress",
      message: "Map source data prepared and files downloaded. Preparing agent source data...",
      context: {
        caseStudyName,
        tracerID,
        jobID,
      },
    });

    // 5.2 Loop for the explicit agentSourceData
    const explicitAgentSourceData = allSourceData.filter((sd) => sd.relativePath === agentSourceDataRelativePath);

    if (explicitAgentSourceData.length === 0) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "No explicit agent source data, as per metadata of the case study, found.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    } else if (explicitAgentSourceData.length > 1) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "More than one explicit agent source data, as per metadata of the case study, found.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    // 5.3 Filter all whose relative paths' stem match the naming; call this set (A)
    const caseStudySourceData = allSourceData.filter((sd) => sd.relativePath.startsWith(sourceDataPathStem));

    // 5.4 Segregate into two groups: (B) mapSourceData; and (C) constructed from (A) by filtering out (B), all images, and adding sourceDataForAgent

    // TODO: to discuss this ugly filter. Would be better if we had some sort of "type" field in the SourceData model
    const imageFileExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg", ".ico", ".heif", ".heic"];

    const caseStudySourceDataWithoutMap = caseStudySourceData.filter((sd) => !mapSourceDataRelativePaths.includes(sd.relativePath) && !imageFileExtensions.some((ext) => sd.relativePath.endsWith(ext)));

    if (caseStudySourceDataWithoutMap.length === 0) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "No source data found for the case study.",
        context: {
          caseStudyName,
          tracerID,
          jobID,
        },
      });
      return;
    }

    const agentSourceData = caseStudySourceDataWithoutMap.concat(explicitAgentSourceData);

    const agentRemoteFiles: RemoteFile[] = agentSourceData.filter((file): file is RemoteFile => file.type === "remote");

    if (agentRemoteFiles.length === 0) {
      this.presenter.presentError({
        status: "error",
        operation: "usecase#case-study",
        message: "After filering, no source data was left to create the agent.",
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

    // 8. Return the Research Context and the map files
    this.presenter.presentSuccess({
      status: "success",
      researchContext: createResearchContextDTO.data,
      mapLocalFiles: mapLocalFiles,
    });
  }
}
