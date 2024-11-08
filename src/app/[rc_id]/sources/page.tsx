import { redirect } from "next/navigation";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { ListSourceDataForResearchContextClientPage } from "../../_components/list-source-data-research-context";
import { type TListSourceDataControllerParameters } from "~/lib/infrastructure/server/controller/list-source-data-controller";
import type ListSourceDataController from "~/lib/infrastructure/server/controller/list-source-data-controller";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import type { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import { Suspense } from "react";

export default async function ListSourceDataForResearchContextServerPage({ params }: { params: { rc_id: string } }) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  const researchContextID = parseInt(params.rc_id);
  // Initialize the source data to show
  const controller = serverContainer.get<ListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);

  const signalFactory = signalsContainer.get<(initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => Signal<TListSourceDataViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA);

  const response: Signal<TListSourceDataViewModel> = signalFactory({
    status: "request",
  });

  const controllerParameters: TListSourceDataControllerParameters = {
    response: response,
    researchContextID: researchContextID,
  };

  await controller.execute(controllerParameters);

  return <ListSourceDataForResearchContextClientPage viewModel={response.value} researchContextID={researchContextID} />;
}
