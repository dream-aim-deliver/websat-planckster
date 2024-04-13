import fs from 'fs';
import path from 'path';
import fetchNode from 'node-fetch';
import type { Response } from 'node-fetch';


export type FileRepositoryDTO = {
    status: boolean;
    code: number;
    errorCode?: number | null;
    errorMessage?: string | null;
    errorName?: string | null;
    errorType?: string | null;
}

export async function uploadFile(signedUrl: string, filePath: string) {

    const fileData = fs.readFileSync(filePath);

    try {

        const response = await fetch(signedUrl, {
            method: 'PUT',
            body: fileData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const dto: FileRepositoryDTO = {
            status: true,
            code: -1
        };
        return dto;
    } catch (error) {
        const dto: FileRepositoryDTO = {
            status: false,
            code: 1,
            errorCode: 1,
            errorMessage: `error`,
            errorName: "Upload Error",
            errorType: "UploadError"
        };
        return dto;
    } 
}

export async function downloadFile(signedUrl: string, filePath: string): Promise<FileRepositoryDTO> {
    try {
      // TODO: typing is broken here because the compiler doesn't understand node-fetch
      const response: Response = await fetchNode(signedUrl);
        if (!response.ok) {
            throw new Error('Download failed');
        }

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // Check if response.body is null
        if (!response.body) {
            throw new Error('No response body');
        }

        // Create a write stream to the file path
        const fileStream = fs.createWriteStream(filePath);

        // Pipe the response body into the file stream
        response.body.pipe(fileStream);

        // Wait for the file stream to finish
        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        return {
            status: true,
            code: -1
        };
    } catch (error) {
        return {
            status: false,
            code: 1,
            errorCode: 1,
            errorMessage: `error`,
            errorName: "Download Error",
            errorType: "DownloadError"
        };
    }
}