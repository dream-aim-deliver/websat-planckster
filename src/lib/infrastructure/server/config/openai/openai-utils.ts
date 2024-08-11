import type { File } from "~/lib/core/entity/file";

/**
 * Generates a filename for OpenAI based on the client ID and file information.
 * 
 * @param clientID - The client ID.
 * @param file - The file object.
 * @returns The generated OpenAI filename.
 */
export const generateOpenAIFilename = (clientID: string, file: File): string => {
    throw new Error("Not implemented");
    //const openaiFileName = `${clientID}_${file.path}_${file.name}`;
    //return openaiFileName;
}


/**
 * Generates a local filename object from an OpenAI filename.
 * 
 * @param openAIFilename - The OpenAI filename in the format: client_id_path_name.
 * @returns An object containing the client_id, path, and name extracted from the OpenAI filename.
 * @throws Error if the OpenAI filename is invalid.
 */
export const generateLocalFilename = (openAIFilename: string): {client_id: string, path: string, name: string} => {
    const [client_id, path, name] = openAIFilename.split("_");
    if(!client_id || !path || !name) {
        throw new Error(`Invalid OpenAI filename. Expected format: client_id_path_name. Got: ${openAIFilename}`);
    }
    return {client_id, path, name};
}