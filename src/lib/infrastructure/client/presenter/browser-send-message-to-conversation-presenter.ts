/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { inject, injectable } from "inversify";
import { ILogObj, Logger } from "tslog";
import { type Signal } from "~/lib/core/entity/signals";
import { type SendMessageToConversationOutputPort } from "~/lib/core/ports/primary/send-message-to-conversation-primary-ports";
import { type TSendMessageToConversationSuccessResponse, type TSendMessageToConversationErrorResponse, type TSendMessageToConversationProgressResponse } from "~/lib/core/usecase-models/send-message-to-conversation-usecase-models";
import { type TSendMessageToConversationViewModel } from "~/lib/core/view-models/send-message-to-conversation-view-model";
import { UTILS } from "../config/ioc/client-ioc-symbols";

@injectable()
export default class BrowserSendMessageToConversationPresenter implements SendMessageToConversationOutputPort<Signal<TSendMessageToConversationViewModel>> {
    response: Signal<TSendMessageToConversationViewModel>;
    private logger: Logger<ILogObj>

    constructor(
        response: Signal<TSendMessageToConversationViewModel>,
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger<ILogObj>
    ) {
        this.response = response;
        this.logger = this.loggerFactory("BrowserSendMessageToConversationPresenter");
    }

    presentProgress(progress: TSendMessageToConversationProgressResponse): void{
        this.logger.info(progress.context);
        this.response.update({
            status: "progress",
            message: progress.message,
            progressReport: progress.progress,
        });
    }

    presentSuccess(success: TSendMessageToConversationSuccessResponse): void {
        this.response.update({
            status: "success",
            message: success.message,
            response: success.response,
        });
    }

    presentError(error: TSendMessageToConversationErrorResponse): void {
        this.response.update({
            status: "error",
            message: error.message,
            context: error.context,
        });
    }
   
}