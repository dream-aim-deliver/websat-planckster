import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import { GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { redirect } from "next/navigation";
import { ViewCaseStudy } from "~/app/_components/view-case-study";

export default async function SDACaseStudyServerPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  // Extract query parameters
  const jobId = searchParams?.jobId;
  const tracerId = searchParams?.tracerId;
  const caseStudy = searchParams?.caseStudy;

  // Validate query parameters
  if (!jobId || Array.isArray(jobId) || !tracerId || Array.isArray(tracerId) || !caseStudy || Array.isArray(caseStudy)) {
    throw Error("Incorrect query parameters specified");
  }

  return <ViewCaseStudy jobId={parseInt(jobId)} caseStudy={caseStudy} tracerId={tracerId} />;
}
