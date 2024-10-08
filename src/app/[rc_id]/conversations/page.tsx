import { redirect } from "next/navigation";
import { ListConversationsClientPage } from "../../_components/list-conversations";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type ListConversationsController from "~/lib/infrastructure/server/controller/list-conversations-controller";
import { type TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";
import type { Signal } from "~/lib/core/entity/signals";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import type { TListConversationsControllerParameters } from "~/lib/infrastructure/server/controller/list-conversations-controller";
import { Suspense } from "react";
import { Header, SiteFooter } from "@maany_shr/rage-ui-kit";

export default async function ListConversationsServerPage({ params }: { params: { rc_id: string } }) {
  const researchContextID = parseInt(params.rc_id);

  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  // Initialize the conversations to show on page load
  const controller = serverContainer.get<ListConversationsController>(CONTROLLERS.LIST_CONVERSATIONS_CONTROLLER);

  const signalFactory = signalsContainer.get<(initialValue: TListConversationsViewModel, update?: (value: TListConversationsViewModel) => void) => Signal<TListConversationsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_CONVERSATIONS);

  const response: Signal<TListConversationsViewModel> = signalFactory({
    status: "request",
  });

  const controllerParameters: TListConversationsControllerParameters = {
    response: response,
    researchContextID: researchContextID,
  };

  await controller.execute(controllerParameters);

  return (
      <Suspense fallback={<div>AG GRID SKELETON...</div>}>
        <ListConversationsClientPage viewModel={response.value} researchContextID={researchContextID}/>
      </Suspense>
  );
}
