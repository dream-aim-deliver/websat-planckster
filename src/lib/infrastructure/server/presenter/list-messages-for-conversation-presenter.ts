import { type Logger } from "pino";
import { type Signal } from "~/lib/core/entity/signals";
import { type ListMessagesForConversationOutputPort } from "~/lib/core/ports/primary/list-messages-for-conversation-primary-ports";
import { type TListMessagesForConversationErrorResponse, type TListMessagesForConversationSuccessResponse } from "~/lib/core/usecase-models/list-messages-for-conversation-usecase-models";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default class ListMessagesForConversationPresenter implements ListMessagesForConversationOutputPort {
    logger: Logger;
    response: Signal<TListMessagesForConversationViewModel>;

    constructor(
        response: Signal<TListMessagesForConversationViewModel>,
        loggerFactory: (module: string) => Logger) {
        this.response = response;
        this.logger = loggerFactory("ListMessagesForConversationPresenter");
        }

    async presentSuccess(usecaseSuccessResponse: TListMessagesForConversationSuccessResponse): Promise<void> {
        this.logger.debug({usecaseSuccessResponse}, `Successfully retrieved ${usecaseSuccessResponse.messages.length} messages for conversation`);
        this.response.update({
            status: "success",
            messages: usecaseSuccessResponse.messages,
        });
    }

    async presentError(usecaseErrorResponse: TListMessagesForConversationErrorResponse): Promise<void> {
        this.logger.error({usecaseErrorResponse}, `Failed to retrieve messages for conversation: ${usecaseErrorResponse.message}`);
        this.response.update({
            status: "error",
            message: usecaseErrorResponse.message,
            context: usecaseErrorResponse.context,
        });
    }

}