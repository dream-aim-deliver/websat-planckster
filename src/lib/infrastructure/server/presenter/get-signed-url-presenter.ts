import type { TGetSignedURLViewModel } from "../../view-models/get-signed-url-view-model";

export default class GetSignedUrlPresenter {
    response: TGetSignedURLViewModel
    constructor(response: TGetSignedURLViewModel) {
        this.response = response;
    }
    presentSuccess(signedUrl: string): void {
        this.response = {
            success: true,
            data: {
                signedUrl: signedUrl
            }
        };
    }
    presentError(operation: string, message: string): void {
        this.response = {
            success: false,
            data: {
                operation: operation,
                message: message
            }
        };
    }
}