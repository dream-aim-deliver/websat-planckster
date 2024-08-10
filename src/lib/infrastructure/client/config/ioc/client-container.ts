/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container, type interfaces } from "inversify";
import { CONTROLLERS, REPOSITORY, TRPC, UTILS } from "./client-ioc-symbols";
import { api } from "~/lib/infrastructure/client/trpc/react-api";
import { api as vanilla } from "~/lib/infrastructure/client/trpc/vanilla-api";
import KernelFileClientRepository from "../../repository/kernel-remote-storage-element";
import BrowserFileUploadController from "../../controller/browser-file-upload-controller";
import config from "./log/tslog-browser-config";
import { Logger } from "tslog";

const clientContainer = new Container();

/** Aspect: Logging */
clientContainer.bind<interfaces.Factory<Logger<unknown>>>(UTILS.LOGGER_FACTORY).toFactory<Logger<unknown>, [string]>((context: interfaces.Context) =>
    (module: string) => {
        const logger = new Logger<unknown>({
            ...config,
            name: module,
        });
        return logger;
    }
);

/** TRPC */
clientContainer.bind(TRPC.REACT_CLIENT_COMPONENTS_API).toConstantValue(api);
clientContainer.bind(TRPC.VANILLA_CLIENT).toConstantValue(vanilla);

/** REPOSITORY */
clientContainer.bind(REPOSITORY.KERNEL_FILE_REPOSITORY).to(KernelFileClientRepository).inSingletonScope();


/** CONTROLLER */
clientContainer.bind(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER).to(BrowserFileUploadController);

export default clientContainer;