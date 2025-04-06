import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import type { LocalFile } from "~/lib/core/entity/file";
import { PPTLoader } from "../../langchain/langchain-pptx-loader";
import type { Logger } from "pino";
import type { Document } from "langchain/document";

/**
 * 
 * @param files The files to load into Documents
 * @param logger 
 * @returns 
 */
export const loadDocuments = async(files: LocalFile[], logger: Logger): Promise < Document[] > => {
    const documents: Document[] = [];
    for(const file of files) {
        let loader;
        const ext = file.name.split('.').pop();
        if (!ext) {
            logger.error(`File ${file.name} has no extension`);
            continue;
        }
        if (ext == "txt") {
            loader = new TextLoader(file.relativePath);
        }
        else if (ext == "pdf") {
            loader = new PDFLoader(file.relativePath, {
                splitPages: true,
            });
        }
        else if (ext == "docx || doc") {
            //loader = new DocxLoader(file.relativePath);
        }
        else if (ext == "csv") {
            loader = new CSVLoader(file.relativePath);
        }
        else if (ext == "pptx" || ext == "ppt") {
            loader = new PPTLoader(file.relativePath);
        }
        if (!loader) {
            logger.error(`File ${file.name} has unsupported extension ${ext}`);
            continue;
        }
        try {
            const loadedDocuments: Document[] = await loader.load();
            documents.push(...loadedDocuments);
        } catch (error) {
            logger.error(`Failed to load file ${file.name}: ${(error as Error).message}`);
        }
    }
        return documents;
}