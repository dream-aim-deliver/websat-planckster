import type { File } from "~/lib/core/entity/file";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a filename for OpenAI based on the client ID and file information.
 * The separator is "<>".
 * The format is: {client_id}<>path<>name.
 * @param clientID - The client ID.
 * @param file - The file object.
 * @returns The generated OpenAI filename.
 */
export const generateOpenAIFilename = (clientID: string, file: File): string => {
  const formattedRelativePath = file.relativePath.replace(/\//g, "_");
  const separator = "<>";
  return `${clientID}${separator}${formattedRelativePath}${separator}${file.name}`;
};

/**
 * Generates a local filename object from an OpenAI filename.
 * The separator is "<>".
 * The format is: {client_id}<>path<>name.
 * @param openAIFilename - The OpenAI filename in the format: client_id_path_name.
 * @returns An object containing the client_id, path, and name extracted from the OpenAI filename.
 * @throws Error if the OpenAI filename is invalid.
 */
export const generateSystemFilename = (openAIFilename: string): { client_id: string; relativePath: string; name: string } => {
  const separator = "<>";
  const parts = openAIFilename.split(separator);
  if (parts.length !== 3) {
    throw new Error(`Invalid OpenAI filename: ${openAIFilename}`);
  }
  const client_id = parts[0];
  const relative_path = parts[1];
  const name = parts[2];
  if (!client_id) {
    throw new Error(`Invalid OpenAI filename: ${openAIFilename}. Missing client_id.`);
  }
  if (!relative_path) {
    throw new Error(`Invalid OpenAI filename: ${openAIFilename}. Missing relative path.`);
  }
  if (!name) {
    throw new Error(`Invalid OpenAI filename: ${openAIFilename}. Missing name.`);
  }
  const formattedPath = relative_path.replace(/_/g, "/");
  return {
    client_id: client_id,
    relativePath: formattedPath,
    name: name,
  };
};

/**
 * Extracts the client ID and research context ID from a vector store name.
 * The format for vector store names is: client_{client_id}_research_context_{research_context_id}.
 * @param vector_store_name - The vector store name.
 * @returns An object containing the client_id and research_context_id extracted from the vector store name.
 * @throws Error if the vector store name is invalid.
 */
export const getClientIDAndResearchContextIDFromVectorStoreName = (vector_store_name: string): { client_id: number; research_context_id: number } => {
  const regex = /client_(\d+)_research_context_(\d+)/;
  const match = vector_store_name.match(regex);
  if (!match) {
    throw new Error(`Failed to extract client_id and research_context_id from vector_store_name: ${vector_store_name}`);
  }
  const clientID = match[1];
  const researchContextID = match[2];
  if (!clientID || !researchContextID) {
    throw new Error(`Failed to extract client_id and research_context_id from vector_store_name: ${vector_store_name}`);
  }
  return {
    client_id: parseInt(clientID),
    research_context_id: parseInt(researchContextID),
  };
};

/**
 * Extracts the client ID and research context ID from an agent name.
 * The format for agent names is: client_{client_id}_research_context_{research_context_id}.
 * @param agent_name - The agent name.
 * @returns { client_id, research_context_id } - An object containing the client_id and research_context_id extracted from the agent name.
 * @throws Error if the agent name is invalid.
 */
export const getClientIDAndResearchContextIDFromAgentName = (agent_name: string): { client_id: number; research_context_id: number } => {
  const regex = /client_(\d+)_research_context_(\d+)/;
  const match = agent_name.match(regex);
  if (!match) {
    throw new Error(`Failed to extract client_id and research_context_id from agent_name: ${agent_name}`);
  }
  const clientID = match[1];
  const researchContextID = match[2];
  if (!clientID || !researchContextID) {
    throw new Error(`Failed to extract client_id and research_context_id from agent_name: ${agent_name}`);
  }
  return {
    client_id: parseInt(clientID),
    research_context_id: parseInt(researchContextID),
  };
};

/**
 * Converts Uint8Array to a base64 string
 * @param uint8Array - The Uint8Array to convert
 * @returns { string } - The base64 string
 */
export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  // Convert the Uint8Array to a binary string
  let binaryString = "";
  uint8Array.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });

  // Use btoa to convert the binary string to base64
  return btoa(binaryString);
};

/**
 * Generates a Research Context External ID from an OpenAI Assistant ID.
 * @param openAIAssistantID
 * @returns
 */
export const generateRCExternalIDFromOpenAIAssistantID = (openAIAssistantID: string): string => {
  return `websat-openai-${openAIAssistantID}`;
};

/**
 * Generates an OpenAI Assistant ID from a Research Context External ID.
 * @param researchContextExternalID
 * @returns
 */
export const generateOpenAIAssistantIDFromRCExternalID = (researchContextExternalID: string): string => {
  return researchContextExternalID.replace("websat-openai-", "");
};

/**
 *  Generates a unique OpenAI Assistant name, using a UUID.
 * @returns { string } - The generated OpenAI Assistant name.
 */
export const generateOpenAIAssistantName = (): string => {
  return `websat-${uuidv4()}`;
};

/**
 * Generates a unique OpenAI Vector Store name, using a UUID.
 * @returns { string } - The generated OpenAI Vector Store name.
 */
export const generateOpenAIVectorStoreName = (): string => {
  return `websat-${uuidv4()}`;
};

/**
 * Supported file formats for OpenAI Vector Store, taken from [OpenAI's docs](https://platform.openai.com/docs/assistants/tools/file-search/supported-files#supported-files).
 */
export const OPENAI_VECTOR_STORE_SUPPORTED_FILE_FORMATS: string[] = [".c", ".cpp", ".cs", ".css", ".doc", ".docx", ".go", ".html", ".java", ".js", ".json", ".md", ".pdf", ".php", ".pptx", ".py", ".rb", ".sh", ".tex", ".ts", ".txt"];

export const OPENAI_CODE_INTERPRETER_MAX_AMOUNT_OF_FILES = 20;

export const DATA_FILE_FORMATS: string[] = [".json", ".txt"];

export const WEBSAT_VECTOR_STORE_FILE_FORMATS = OPENAI_VECTOR_STORE_SUPPORTED_FILE_FORMATS.filter((format) => !DATA_FILE_FORMATS.includes(format));

export const generateOpenAiAssistantInstructions = (researchContextTitle: string, researchContextDescription: string, jsonFileId: string | undefined, txtFileId: string | undefined): string => {
  // concatenated-json-files.json
  // concatenated-txt-files.txt

  let jsonFileInstructions = "";
  if (jsonFileId !== undefined) {
    jsonFileInstructions = ` The file '${jsonFileId}' contains a concatenation of JSON data. Within this file, there are markers that indicate the source files of the JSON data. The markers have the following structure: \"### START OF FILE: '\${file.name}' ###\" and \"### END OF FILE ###\". When a user references a specific JSON source file, please search for the data that is between the start of file comment which refers to that source file name, and the next end of file comment.`;
  }

  let txtFileInstructions = "";
  if (txtFileId !== undefined) {
    txtFileInstructions = ` The file '${txtFileId}' contains a concatenation of TXT data. Within this file, there are markers that indicate the source files of the TXT data. The markers have the following structure: \"### START OF FILE: '\${file.name}' ###\" and \"### END OF FILE ###\". When a user references a specific TXT source file, please search for the data that is between the start of file comment which refers to that source file name, and the next end of file comment.`;
  }

  const instructions = `You are an expert data analyst specialized working in the research context with title \"${researchContextTitle}\". This research context has the following description \"${researchContextDescription}\". You have also been assigned some files and you have access to scraped data and some results produced by us in your vector store. Some of these are images in different formats (e.g., JPG, JPEG, PNG, etc.), assigned to you via normal code interpreter.${jsonFileInstructions}${txtFileInstructions} Other files, containing key data, have been assigned to you via a vector store. Please consider files from both sources anytime the user asks you about files you have access to, and name which sources you're drawing from.
  You will help me and my team explore and analyze the datasets that we have augmented. If you do not find an answer in the data and files available to you, please explicitly state that you do not have enough information. You have access to a code interpreter to generate insights from the data, and a file search tool to find relevant datasets. If your response can only draw from some files and not others, please state that explicitly in your response. Specifically, please name if the user's request requires using the code interpreter, and please include the caveat that files in the vector store might not be included in your findings. If possible, suggest alternative approaches that could include a larger set of files. If the methods available to fulfill the user's request do not allow for an accurate response, such as when files from the vector store are referenced and the code interpreted cannot be used, state explicitly the method used, that it may not be accurate, along with any tips on how an accurate response might be achieved.`;

  return instructions;
};
