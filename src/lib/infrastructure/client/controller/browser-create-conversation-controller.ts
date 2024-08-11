import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TCreateConversationViewModel } from "~/lib/core/view-models/create-conversation-view-model";

export interface TBrowserCreateConversationControllerParameters {
    response: TSignal<TCreateConversationViewModel>;
    researchContextId: string;
    title: string;
}

@injectable()
export default class BrowserCreateConversationController {
    async execute(params: TBrowserCreateConversationControllerParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
}