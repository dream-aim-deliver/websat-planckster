import "reflect-metadata";
import { Container } from "inversify";
import { CONTROLLERS, REPOSITORY, TRPC } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";
import KernelFileClientRepository from "../../repository/kernel-planckster-file-repository";
import BrowserFileUploadController from "../../controller/browser-file-upload-controller";

const clientContainer = new Container();

/** GATEWAYS */
clientContainer.bind(TRPC.REACT_CLIENT_COMPONENTS_API).toConstantValue(api);

/** REPOSITORY */
clientContainer.bind(REPOSITORY.KERNEL_FILE_REPOSITORY).to(KernelFileClientRepository);

/** CONTROLLER */
clientContainer.bind(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER).to(BrowserFileUploadController);

export default  clientContainer;