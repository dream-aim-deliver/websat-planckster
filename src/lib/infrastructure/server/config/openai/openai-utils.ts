import type { File } from "~/lib/core/entity/file";

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
}

/**
 * Generates a local filename object from an OpenAI filename.
 * The separator is "<>".
 * The format is: {client_id}<>path<>name.
 * @param openAIFilename - The OpenAI filename in the format: client_id_path_name.
 * @returns An object containing the client_id, path, and name extracted from the OpenAI filename.
 * @throws Error if the OpenAI filename is invalid.
 */
export const generateLocalFilename = (openAIFilename: string): { client_id: string, relativePath: string, name: string } => {
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
    }
}

/**
 * Generates a vector store name based on the client ID and research context ID.
 * The format is: client_{client_id}_research_context_{research_context_id}.
 * @param client_id 
 * @param research_context_id 
 * @returns 
 */
export const generateVectorStoreName = (client_id: number, research_context_id: number): string => {
    return `client_${client_id}_research_context_${research_context_id}`;
}

/**
 * Extracts the client ID and research context ID from a vector store name.
 * The format for vector store names is: client_{client_id}_research_context_{research_context_id}.
 * @param vector_store_name - The vector store name.
 * @returns An object containing the client_id and research_context_id extracted from the vector store name.
 * @throws Error if the vector store name is invalid.
 */
export const getClientIDAndResearchContextIDFromVectorStoreName = (vector_store_name: string): { client_id: number, research_context_id: number } => {
    const regex = /client_(\d+)_research_context_(\d+)/;
    const match = vector_store_name.match(regex);
    if (!match) {
        throw new Error(`Failed to extract client_id and research_context_id from vector_store_name: ${vector_store_name}`);
    }
    const clientID = match[1];
    const researchContextID = match[2];
    if(!clientID || !researchContextID) {
        throw new Error(`Failed to extract client_id and research_context_id from vector_store_name: ${vector_store_name}`);
    }
    return {
        client_id: parseInt(clientID),
        research_context_id: parseInt(researchContextID),
    }
}