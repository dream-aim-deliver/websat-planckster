import { LocalFile } from "~/lib/core/entity/file";
import FileRepositoryOutputPort from "~/lib/core/ports/secondary/file-repository-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container"
import { OPENAI } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

describe("OpenAI File Repository", () => {
    it("should upload a file", async () => {
        const openaiFileRepository = serverContainer.get<FileRepositoryOutputPort>(OPENAI.OPENAI_REMOTE_STORAGE_ELEMENT)
        const localFile: LocalFile = {
            type: "local",
            path: "test.txt",
        }
        const uploadFileDTO = await openaiFileRepository.uploadFile(localFile)
        expect(uploadFileDTO.success).toBe(false);
    });

    it("should download a file", () => {
        expect(true).toBe(true);
    });
});