"use client";

import { useEffect, useState } from "react";
import { CaseStudyPage } from "@maany_shr/rage-ui-kit";
import { TCaseStudyViewModel } from "~/lib/core/view-models/case-study-view-model";
import { useMutation } from "@tanstack/react-query";
import { caseStudyMutation, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY } from "~/app/queries";
import {ChatClientPage} from "~/app/_components/chat-page";

type ViewCaseStudyProps = {
  caseStudy: string;
  jobId: number;
  tracerId: string;
};

export const ViewCaseStudy = (props: ViewCaseStudyProps) => {
  const [caseStudyViewModel, setCaseStudyViewModel] = useState<TCaseStudyViewModel>({
    status: "request",
    caseStudyName: "",
    tracerID: "",
    jobID: 1,
  } as TCaseStudyViewModel);

  const createMutation = useMutation({
    mutationKey: ["trigger-case-study"],
    retry: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
    mutationFn: caseStudyMutation(setCaseStudyViewModel),
  });

  useEffect(() => {
    createMutation.mutate({
      caseStudyName: props.caseStudy,
      tracerID: props.tracerId,
      jobID: props.jobId,
    });
  }, []);

  if (caseStudyViewModel.status === "request") {
    return <span>Loading...</span>;
  }

  if (caseStudyViewModel.status === "progress") {
    return <span>{caseStudyViewModel.message}</span>;
  }

  if (caseStudyViewModel.status === "error") {
    return <span>{caseStudyViewModel.message}</span>;
  }

  return (
    <CaseStudyPage
      info={caseStudyViewModel.metadata}
      sideComponent={
        <ChatClientPage
          conversationID={caseStudyViewModel.conversation.id}
          researchContextID={caseStudyViewModel.researchContext.id}
          researchContextExternalID={caseStudyViewModel.researchContext.externalID}
          listMessagesViewModel={{ status: "request", conversationID: caseStudyViewModel.conversation.id }}
        />
      }
    />
  );
};
