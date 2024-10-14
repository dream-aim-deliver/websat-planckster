import { Logger } from "pino";
import { Signal } from "~/lib/core/entity/signals";
import { CreateResearchContextOutputPort } from "~/lib/core/ports/primary/create-research-context-primary-ports";
import { TCreateResearchContextErrorResponse, TCreateResearchContextProgressResponse, TCreateResearchContextSuccessResponse } from "~/lib/core/usecase-models/create-research-context-usecase-models";
import { TCreateResearchContextViewModel } from "~/lib/core/view-models/create-research-context-view-models";

export default class CreateResearchContextPresenter implements CreateResearchContextOutputPort<any> {
    logger: Logger;
    response: Signal<TCreateResearchContextViewModel>;
    constructor(response: Signal<TCreateResearchContextViewModel>, loggerFactory: (module: string) => Logger) {
        this.response = response;
        this.logger = loggerFactory("CreateResearchContextPresenter");
    }

    async presentSuccess(usecaseSuccessResponse: TCreateResearchContextSuccessResponse): Promise<void> {
        this.logger.debug({ usecaseSuccessResponse }, `Successfully created research context: ${usecaseSuccessResponse.researchContext.title}`);
        this.response.update({
            status: "success",
            researchContext: usecaseSuccessResponse.researchContext,
        });
    }

    async presentProgress(usecaseProgressResponse: TCreateResearchContextProgressResponse): Promise<void> {
        this.logger.debug({ usecaseProgressResponse }, `Progress creating research context: ${usecaseProgressResponse.message}`);
        this.response.update({
            status: usecaseProgressResponse.status,
            message: usecaseProgressResponse.message,
            context: usecaseProgressResponse.context,
        });
    }

    async presentError(usecaseErrorResponse: TCreateResearchContextErrorResponse): Promise<void> {
        this.logger.error({ usecaseErrorResponse }, `Failed to create research context: ${usecaseErrorResponse.message}`);
        this.response.update({
            status: "error",
            message: usecaseErrorResponse.message,
            context: usecaseErrorResponse.context,
        });
    }
}