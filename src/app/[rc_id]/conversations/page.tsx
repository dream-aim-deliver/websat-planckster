import { redirect } from "next/navigation";
import { ListConversationsClientPage } from "../../_components/list-conversations";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type ListConversationsController from "~/lib/infrastructure/server/controller/list-conversations-controller";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export default async function ListConversationsServerPage({ params }: { params: { rc_id: string } }) {

  const researchContextID = parseInt(params.rc_id);

  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  // Initialize the conversations to show on page load
  const listConversationsController = serverContainer.get<ListConversationsController>(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER);

  const viewModel: TListConversationsViewModel = await listConversationsController.execute({
    researchContextID: researchContextID,
  });

  return (
      <ListConversationsClientPage
        {...viewModel}
      />
    );
}
