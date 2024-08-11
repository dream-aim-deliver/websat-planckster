import { SendMessageToConversationInputPort, SendMessageToConversationOutputPort } from "../ports/primary/send-message-to-conversation-primary-ports";
import { TSendMessageToConversationRequest } from "../usecase-models/send-message-to-conversation-usecase-models";

export default class SendMessageToConversationUsecase implements SendMessageToConversationInputPort {
    presenter: SendMessageToConversationOutputPort<any>;
    //messageRepository:
    //agentGateway: 

    constructor(presenter: SendMessageToConversationOutputPort<any>) {
        this.presenter = presenter;
    }

    async execute(request: TSendMessageToConversationRequest): Promise<void> {

        const { clientID, researchContextID, conversationID, message } = request;

        this.presenter.presentProgress({
            message: {senderType: "user"},
            progress: "Initiating message sending"
        });


        return;
    }

}