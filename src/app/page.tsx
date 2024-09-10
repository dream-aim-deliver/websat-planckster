import { redirect } from "next/navigation";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { ListResearchContextsClientPage } from "../app/_components/list-research-contexts";
import {type TListResearchContextsControllerParameters} from "~/lib/infrastructure/server/controller/list-research-contexts-controller";
import type ListResearchContextsController from "~/lib/infrastructure/server/controller/list-research-contexts-controller";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { type TListResearchContextsViewModel } from "~/lib/core/view-models/list-research-contexts-view-models";
import type { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import { Suspense } from "react";
import type ListSourceDataController from "~/lib/infrastructure/server/controller/list-source-data-controller";
import type { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";

export default async function ListResearchContextsServerPage() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  const clientID = sessionDTO.data.user.kp.client_id;
  // Initialize the research contexts to show
  const controller = serverContainer.get<ListResearchContextsController>(CONTROLLERS.LIST_RESEARCH_CONTEXTS_CONTROLLER);

  const signalFactory = signalsContainer.get<(initialValue: TListResearchContextsViewModel, update?: (value: TListResearchContextsViewModel) => void) => Signal<TListResearchContextsViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_RESEARCH_CONTEXTS);

  const response: Signal<TListResearchContextsViewModel> = signalFactory({
    status: "request",
  });

  const controllerParameters: TListResearchContextsControllerParameters = {
    response: response,
    clientID: `${clientID}`,
  };

  await controller.execute(controllerParameters);

  const listSourceDataForClientController = serverContainer.get<ListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);
  const listSourceDataForClientResponseSignalFactory = signalsContainer.get<(initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => Signal<TListSourceDataViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA);
  const listSourceDataForClientResponse: Signal<TListSourceDataViewModel> = listSourceDataForClientResponseSignalFactory({
    status: "request",
  });

  const listSourceDataForClientControllerParameters = {
    response: listSourceDataForClientResponse,
    clientID: `${clientID}`,
  };

  await listSourceDataForClientController.execute(listSourceDataForClientControllerParameters);

  if(listSourceDataForClientResponse.value.status !== "success") {
    return (
      <div>Error: {`${JSON.stringify(listSourceDataForClientResponse.value)}`}</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div>AG GRID SKELETON...</div>}>
        <ListResearchContextsClientPage viewModel={response.value} clientSourceData={listSourceDataForClientResponse.value.sourceData}/>
      </Suspense>
    </div>
  );
}