import type VectorStoreOutputPort from "~/lib/core/ports/secondary/vector-store-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { LANGCHAIN } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type LangchainVectorStoreGateway from "~/lib/infrastructure/server/gateway/langchain-vector-store-gateway";

export default async function DealAnalysisServerPage() {
  serverContainer.load();
  const langchainVectorStoreGateway = serverContainer.get<LangchainVectorStoreGateway>(LANGCHAIN.LANGCHAIN_VECTOR_STORE);
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
  return (
    <div className="flex grow flex-col gap-4">
      <div className="text-2xl font-bold">Deal Analysis</div>
      <div className="text-lg">This page is under construction.</div>
    </div>
  );
}
