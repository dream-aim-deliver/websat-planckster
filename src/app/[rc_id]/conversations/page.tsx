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
    <div id="page-layout" className="flex flex-col items-center justify-between gap-4 p-4">
      <div id="header" className="flex w-full flex-row items-center justify-between">
        <div id="title" className="text-2xl font-bold">
          Satellite Data Augmentation{" "}
        </div>
        <div id="menu" className="flex flex-row items-center justify-between gap-4">
          <div id="new-conversation" className="flex flex-row items-center justify-between gap-4">
            <button id="new-conversation-button" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Home
            </button>
          </div>
          <div id="upload" className="flex flex-row items-center justify-between gap-4">
            <button id="upload-button" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Docs
            </button>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>AG GRID SKELETON...</div>}>
        <ListConversationsClientPage viewModel={response.value} researchContextID={researchContextID}/>
      </Suspense>
    </div>
  );
}
