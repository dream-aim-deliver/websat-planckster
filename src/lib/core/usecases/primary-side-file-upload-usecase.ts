// import { type FileUploadInputPort, type FileUploadOutputPort } from "../ports/primary/file-repository-input-port";
// import type FileRepositoryOutputPort from "../ports/secondary/file-repository-output-port";
// import { type TFileUploadRequest } from "../usecase-models/file-upload-usecase-models";
// import path from "path";



// export default class FileUploadingUseCase implements FileUploadInputPort {
    // presenter: FileUploadOutputPort<any>;
    // fileRepository: FileRepositoryOutputPort;
    // //sourceDataRepository: SourceDataRepositoryOutputPort;  // TODO: implement this
    // serverApi: TServerComponentAPI;  // TODO: DON'T DO THIS, do what's above and inject it in the usual way

    // constructor(presenter: FileUploadOutputPort<any>, fileRepository: FileRepositoryOutputPort, serverApi: TServerComponentAPI) {
        // this.presenter = presenter;
        // this.fileRepository = fileRepository;
        // this.serverApi = serverApi;
    // }

    // async execute(request: TFileUploadRequest): Promise<void> {

        // try {
        // const { file } = request;

        // this.presenter.presentProgress({
            // message: "Uploading file",
            // progress: 0
        // });

        // const sourceData = this.serverApi.kernel.sourceData

        // if (!sourceData) {
            // this.presenter.presentError({
                // message: "An error occurred"
            // });
            // return;
        // }

        // const relativePath = `user-uploads/${path.basename(file.name)}`

        // this.presenter.presentProgress({
            // message: "Processing local file",
            // progress: 25
        // });

        // const signedUrl = await sourceData.getUploadSignedUrl(
            // {
                // protocol: "s3",
                // relativePath: relativePath 
            // }
        // )

        // if (typeof signedUrl !== 'string' || signedUrl.length === 0) {
            // this.presenter.presentError({
                // message: "An error occurred"
            // });
            // return;
        // }

        // this.presenter.presentProgress({
            // message: "Uploading file to S3",
            // progress: 50
        // });

        // const uploadFileDTO = await this.fileRepository.uploadFile(
            // signedUrl,
            // file
        // )

        // if (!uploadFileDTO.success) {
            // this.presenter.presentError({
                // message: "An error occurred"
            // });
            // return;
        // }

        // this.presenter.presentProgress({
            // message: "Creating source data",
            // progress: 75
        // });

        // const response = await sourceData.create({
            // protocol: "s3",
            // relativePath: relativePath,
            // sourceDataName: file.name,
        // })

        // if (typeof response !== 'object' || !response) {
            // this.presenter.presentError({
                // message: `An error occurred. Could not create source data. response dump: ${JSON.stringify(response)}`
            // });
            // return;
        // }

        // this.presenter.presentProgress({
            // message: "File uploaded successfully",
            // progress: 100
        // });

        // this.presenter.presentSuccess({
            // message: "File uploaded successfully",
            // fileName: file.name
        // });


    // } catch (error) {
        // this.presenter.presentError({
            // message: "An error occurred"
            // });
        // }
    // }
// }