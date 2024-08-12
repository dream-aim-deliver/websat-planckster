import { redirect } from "next/navigation";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import {
  CONTROLLERS,
  GATEWAYS,
} from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import type ListSourceDataController from "~/lib/infrastructure/server/controller/list-source-data-controller";
import type { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { TSignal } from "~/lib/core/entity/signals";
import { ListSourcesForClientPage } from "./_components/list-sources";

export default async function ListSourcesServerPage() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(
    GATEWAYS.AUTH_GATEWAY,
  );
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }
  const viewModel =  new TSignal<TListSourceDataViewModel>(
    "ListSourceDataViewModel",
    "List of source data",
    {
      status: "request",
    },
  );
  const listSourceDataController = serverContainer.get<ListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER)
  
  await listSourceDataController.execute({
    response: viewModel,
  });


  return (
    <div className="flex flex-col items-center just-between h-full">
      <ListSourcesForClientPage initialData={viewModel.value} />
    </div>
  );
}
