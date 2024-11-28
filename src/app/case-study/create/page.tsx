import { redirect } from "next/navigation";
import AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { CreateCaseStudy } from "~/app/_components/create-case-study";
import type ListSourceDataController from "~/lib/infrastructure/server/controller/list-source-data-controller";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import type { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import type { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";

export default async function SDACaseStudyServerPage() {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  const clientID = sessionDTO.data.user.kp.client_id;

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

  if (listSourceDataForClientResponse.value.status !== "success") {
    switch (listSourceDataForClientResponse.value.status) {
      case "error":
        throw new Error(listSourceDataForClientResponse.value.message);
      case "request":
        return <div>Loading...</div>;
    }
  }

  return <CreateCaseStudy initialViewModel={listSourceDataForClientResponse.value} />;
}
