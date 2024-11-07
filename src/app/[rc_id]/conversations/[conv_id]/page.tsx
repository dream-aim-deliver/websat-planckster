import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ChatClientPage, ChatClientPageSkeleton } from "../../../_components/chat-page";
import type { Signal } from "~/lib/core/entity/signals";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import type ConversationGatewayOutputPort from "~/lib/core/ports/secondary/conversation-gateway-output-port";
import type ResearchContextGatewayOutputPort from "~/lib/core/ports/secondary/research-context-gateway-output-port";
import { type TListMessagesForConversationViewModel } from "~/lib/core/view-models/list-messages-for-conversation-view-model";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { CONTROLLERS, GATEWAYS } from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";
import { type TListMessagesForConversationControllerParameters } from "~/lib/infrastructure/server/controller/list-messages-for-conversation-controller";
import type ListMessagesForConversationController from "~/lib/infrastructure/server/controller/list-messages-for-conversation-controller";

export default async function ChatServerPage({ params }: { params: { rc_id: string; conv_id: string } }) {
  // Auth check
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();
  if (!sessionDTO.success) {
    redirect("/auth/login");
  }

  // Check if the research context and conversation exist for the current client
  const researchContextID = parseInt(params.rc_id);
  const conversationID = parseInt(params.conv_id);

  const researchContextGateway = serverContainer.get<ResearchContextGatewayOutputPort>(GATEWAYS.KERNEL_RESEARCH_CONTEXT_GATEWAY);

  const listResearchContextsDTO = await researchContextGateway.list();
  if (!listResearchContextsDTO.success) {
    throw new Error(`Server error: Could not list research contexts. Please try again later.`);
  }

  const researchContextsDTOs = listResearchContextsDTO.data;
  const researchContextDTO_result = researchContextsDTOs.find((rcDTO) => rcDTO.id == researchContextID);
  if (!researchContextDTO_result || researchContextDTO_result.status != "active") {
    notFound();
  }

  const researchContextExternalID = researchContextDTO_result.externalID;

  const conversationGateway = serverContainer.get<ConversationGatewayOutputPort>(GATEWAYS.KERNEL_CONVERSATION_GATEWAY);

  const listConversationsDTO = await conversationGateway.listConversations(researchContextID);
  if (!listConversationsDTO.success) {
    throw new Error(`Server error: Could not list conversations. Please try again later.`);
  }

  const conversations = listConversationsDTO.data;
  const conversationIDs = conversations.map((conv) => conv.id);
  if (!conversationIDs.includes(conversationID)) {
    notFound();
  }

  // Initialize the messages to show on page load
  const listMessagesController = serverContainer.get<ListMessagesForConversationController>(CONTROLLERS.LIST_MESSAGES_CONTROLLER);

  const signalFactory = signalsContainer.get<(initialValue: TListMessagesForConversationViewModel, update?: (value: TListMessagesForConversationViewModel) => void) => Signal<TListMessagesForConversationViewModel>>(
    SIGNAL_FACTORY.KERNEL_LIST_MESSAGES_FOR_CONVERSATION,
  );

  const response: Signal<TListMessagesForConversationViewModel> = signalFactory({
    status: "request",
    conversationID: conversationID,
  });

  const controllerParameters: TListMessagesForConversationControllerParameters = {
    response: response,
    conversationID: conversationID,
  };

  await listMessagesController.execute(controllerParameters);

  return (
    <Suspense fallback={<ChatClientPageSkeleton />}>
      <ChatClientPage listMessagesViewModel={response.value} researchContextExternalID={researchContextExternalID} researchContextID={researchContextID} conversationID={conversationID} />
    </Suspense>
  );
}
