import type VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { LANGCHAIN } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

export default async function DealAnalysisServerPage() {
  serverContainer.load();
  const langchainVectorStoreGateway = serverContainer.get<VectorStoreOutputPort>(LANGCHAIN.LANGCHAIN_VECTOR_STORE);
  const createVectorStoreDTO = await langchainVectorStoreGateway.createVectorStore("test-vector-store", [
    {
      id: "1",
      type: "remote",
      provider: "kernel#s3",
      name: "PitchBook - NVCA Venture Monitor 2024 Q4",
      relativePath: "PitchBook-NVCA-Venture-Monitor2024Q4.pdf",
      createdAt: "2025-04-05T14:51:04.670590",
    },
    {
      id: "2",
      type: "remote",
      provider: "kernel#s3",
      name: "PitchBook Benchmarks (with preliminary Q3 2024 data)",
      relativePath: "PitchBook-Benchmarks-preliminary-Q3-2024-data.pdf",
      createdAt: "2025-04-05T14:51:04.742923",
    },
    {
      id: "3",
      type: "remote",
      provider: "kernel#s3",
      name: "AI, Healthcare, and Life Sciences VC Market Snapshot 2025",
      relativePath: "AI-Healthcare-Life-Sciences-VC-Market-Snapshot2025.pdf",
      createdAt: "2025-04-05T14:51:04.849203",
    },
  ]);
  if (!createVectorStoreDTO.success) {
    return (
      <div className="flex grow flex-col gap-4">
        <div className="text-2xl font-bold">Deal Analysis</div>
        <div className="text-red-500">Error creating vector store: {JSON.stringify(createVectorStoreDTO.data)}</div>
      </div>
    );
  }
  const successfulFiles = createVectorStoreDTO.data.embeddings ?? [];
  console.log("successfulFiles", successfulFiles);
  const failedFiles = createVectorStoreDTO.data.unsupportedFiles ?? [];
  return <div className="flex grow flex-col gap-4">
    <div className="text-2xl font-bold">Deal Analysis</div>
    <div>
        <div className="text-green-500">
            <div className="font-bold">Successful Files:</div>
            <ul>
                {successfulFiles.map((file, index) => (
                    <li key={index}>
                        <div className="font-bold">{file.provider}</div>
                        <ul>
                            {file.files.map((nestedFile, nestedIndex) => (
                                <li key={nestedIndex}>
                                    <div className="font-bold">{nestedFile.name}</div>
                                    {/* <div>{nestedFile.relativePath}</div> */}
                                    <div>{nestedFile.createdAt}</div>
                                    <div>{nestedFile.provider}</div>
                                    <div>{nestedFile.id}</div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
        <div className="text-red-500 mt-4">
            <div className="font-bold">Failed Files:</div>
            <ul>
                {failedFiles.map((file, index) => (
                    <li key={index}>{file.relativePath}</li>
                ))}
            </ul>
        </div>
    </div>

  </div>;
}
