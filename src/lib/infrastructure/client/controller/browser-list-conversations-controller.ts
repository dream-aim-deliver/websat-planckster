import { injectable } from "inversify";
import { TSignal } from "~/lib/core/entity/signals";
import { TListConversationsViewModel } from "~/lib/core/view-models/list-conversations-view-model";

export interface BrowserListConversationsControllerParameters {
    response: TSignal<TListConversationsViewModel>;
    researchContextId: string;
}

@injectable()
export default class BrowserListConversationsController {
    async execute(params: BrowserListConversationsControllerParameters): Promise<void> {
        throw new Error("Method not implemented.");
    }
}