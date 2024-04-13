import axios from 'axios';
import fs from 'fs';
import type * as stream from 'stream';

export type FileRepositoryDTO = {
    status: boolean;
    code: number;
    errorCode?: number | null;
    errorMessage?: string | null;
    errorName?: string | null;
    errorType?: string | null;
}

export async function uploadFile(signedUrl: string, filePath: string) {

  try {
    // Read the file from the file system
    const file = fs.createReadStream(filePath);

    // Use axios to upload the file to MinIO
    await axios.put(signedUrl, file, {
        headers: {
        'Content-Type': 'application/octet-stream',
        },
    });

    const dto: FileRepositoryDTO = {
        status: true,
        code: -1
        }
    return dto

  } catch (error) {
    const dto: FileRepositoryDTO = {
        status: false,
        code: 1,
        errorCode: 1,
        errorMessage: `error`,
        errorName: "Upload Error",
        errorType: "UploadError"
    }
    return dto
  }
}

export async function downloadFile(signedUrl: string, filePath: string) {
  try {
    // Use axios to download the file from MinIO
    const response = await axios.get(signedUrl, {
        responseType: 'stream',
    });

    // Write the file to the file system
    (response.data as stream.Readable).pipe(fs.createWriteStream(filePath));

    const dto: FileRepositoryDTO = {
        status: true,
        code: -1
        }
    return dto

  } catch (error) {
    const dto: FileRepositoryDTO = {
        status: false,
        code: 1,
        errorCode: 1,
        errorMessage: `error`,
        errorName: "Download Error",
        errorType: "DownloadError"
    }
    return dto
  }
}
