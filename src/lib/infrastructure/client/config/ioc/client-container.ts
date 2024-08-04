import "reflect-metadata";
import { Container } from "inversify";
import { TRPC } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";

const clientContainer = new Container();

clientContainer.bind(TRPC.REACT_CLIENT_COMPONENTS_API).toConstantValue(api);

export default  clientContainer;