import { type OfficeParserConfig, parseOfficeAsync } from 'officeparser';
import { BaseDocumentLoader } from '@langchain/core/document_loaders/base';
import { Document } from 'langchain/document';

export class PPTLoader extends BaseDocumentLoader {
    filePath: string;
    config: OfficeParserConfig;
    constructor(filePath: string) {
        super();
        this.filePath = filePath;
        this.config= {
            newlineDelimiter: " ",  // Separate new lines with a space instead of the default \n.
            ignoreNotes: true       // Ignore notes while parsing presentation files like pptx or odp.
        }
    }

    async load(): Promise<Document[]> {
        const documents = await parseOfficeAsync(this.filePath, this.config);
        return [new Document({ 
            pageContent: documents, 
            metadata: { source: this.filePath }
        })]
    }

}
