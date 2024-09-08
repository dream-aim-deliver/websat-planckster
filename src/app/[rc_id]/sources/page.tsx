import { redirect } from "next/navigation";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS, TRPC } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import ListSourceDataController from "~/lib/infrastructure/server/controller/list-source-data-controller";
import type { TServerComponentAPI } from "~/lib/infrastructure/server/trpc/server-api";

//export default async function Home(
    //{ params }: { params: { rc_id: number } }
//) {
  //const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  //const sessionDTO = await authGateway.getSession();
  //if (!sessionDTO.success) {
    //redirect("/auth/login");
  //};
  //return (
        //<ListSourceData rc_id={params.rc_id} />
  //);
//}

//async function ListSourceData({ rc_id }: { rc_id: number }) {
  //const controller = serverContainer.get<ListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);
  
  //const sourceDataVM = await api.kernel.sourceData.list(
    //{
        //researchContextID: rc_id,
    //}
  //)

  //if (sourceDataVM.status === "error") {
    //return <div>Error: {sourceDataVM.message}</div>;
  //}

  //if (sourceDataVM.status === "success" && !sourceDataVM.sourceData) {
    //return <div>No source data found</div>;
  //}

  //if (sourceDataVM.status === "success" && sourceDataVM.sourceData.length === 0) {
    //return <div>No source data found</div>;
  //}

  //if (sourceDataVM.status === "success") {
  //const sourceData = sourceDataVM.sourceData;

  //// Return a simple HTML unordered list
  //return (
   //<ul>
    //{sourceData.map((data, index) => (
      //<li key={index}>
        //{data.relativePath}
      //</li>
    //))}
  //</ul>   

  //);

//}
//}