import { type ILogObj } from "tslog";

const DevConfig: ILogObj = {
    type: "pretty",
    name: "RootBrowserLogger",
    instanceName: "RootBrowserLogger",
    displayFilePath: "hidden",
    displayFunctionName: false,
    displayInstanceName: false,
    displayDateTime: true,
    displayRequestId: true,
}

const ProdConfig: ILogObj = {
    type: "json",
    name: "RootBrowserLogger",
    instanceName: "RootBrowserLogger",
    displayFilePath: "hidden",
    displayFunctionName: false,
    displayInstanceName: false,
    displayDateTime: true,
    displayRequestId: true,
}

let config: ILogObj;

if (process.env.NODE_ENV === "production") {
    config = ProdConfig;
} else {
    config = DevConfig;
}

export default config;