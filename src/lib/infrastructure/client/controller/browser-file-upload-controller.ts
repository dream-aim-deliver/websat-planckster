import { injectable } from "inversify";
import clientContainer from "../config/ioc/client-container";
import { PRESENTER, REPOSITORY } from "../config/ioc/client-ioc-symbols";
import BrowserFileUploadPresenter from "../presenter/browser-file-upload-presenter";
import type KernelFileClientRepository from "../repository/kernel-planckster-file-repository";
import { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { TSignal } from "~/lib/core/entity/signals";



export interface TBrowserFileUploadControllerParameters {
    file: File,
    response: TSignal<TFileUploadingViewModel>
}


@injectable()
export default class BrowserFileUploadController {

    // TODO: this should create the source data too, not just upload the file

    async execute(controllerParameters: TBrowserFileUploadControllerParameters): Promise<void> {

        const { file } = controllerParameters;

        /* this would be the place to call the file upload usecase */
        const presenter = new BrowserFileUploadPresenter(controllerParameters.response);
        const kernelFileRepository = clientContainer.get<KernelFileClientRepository>(REPOSITORY.KERNEL_FILE_REPOSITORY);  // would be injected


        const dto = await kernelFileRepository.uploadFile(file); 

        if (!dto.success == true) {
            presenter.presentError(
                {
                    message: `An error occurred: ${dto.data.message}`
                }
            )
        } else {
            presenter.presentProgress(
                {
                    message: `File uploaded successfully`,
                    progress: 50
                }
            )
        }
    // TODO: turn this into part of this controller

    //const api = clientContainer.get<TClientComponentAPI>(TRPC.REACT_CLIENT_COMPONENTS_API); const uploadSourceDataMutation = api.kernel.sourceData.create.useMutation({
        //onSuccess: () => {
            //console.log("Source data uploaded");
        //},
    //});

    //return (
        //<div>
            //<button
                //onClick={() => {
                    //uploadSourceDataMutation.mutate({
                        //protocol: props.protocol,
                        //relativePath: props.relativePath,
                        //sourceDataName: props.sourceDataName,
                    //});
                //}}
            //>
                //Upload Source Data
            //</button>
            //{uploadSourceDataMutation.isError && (
                //<div>Error: {JSON.stringify(uploadSourceDataMutation.error)}</div>
            //)}
        //</div>
    //);

    }
}

