import "reflect-metadata";
import { Container } from "inversify";
import { CONTROLLERS, PRESENTER, REPOSITORY, TRPC } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";
import BrowserFileUploadPresenter from "~/lib/infrastructure/client/presenter/browser-file-upload-presenter";
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