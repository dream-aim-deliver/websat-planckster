"use client";

import { useEffect, useState } from "react";
import { CaseStudyPage } from "@maany_shr/rage-ui-kit";
import type { TCaseStudyViewModel } from "~/lib/core/view-models/case-study-view-model";
import { useMutation } from "@tanstack/react-query";
import { caseStudyMutation, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY } from "~/app/queries";
import { ChatClientPage } from "~/app/_components/chat-page";

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
    return (
      <div className="h-screen w-screen justify-center">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Loading...</h2>
          <p>Please wait while we process your request.</p>
        </div>
      </div>
    );
  }

  if (caseStudyViewModel.status === "progress") {
    return (
      <div className="h-screen w-screen justify-center">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Creating case study...</h2>
          <p>Please wait while we process your request.</p>
        </div>
      </div>
    );
  }

  if (caseStudyViewModel.status === "error") {
    return (
      <div className="h-screen w-screen justify-center">
        <div className="rounded-lg bg-red-800 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Error!</h2>
          <p>Could not setup your case study.</p>
        </div>
      </div>
    );
  }

  return (
    <CaseStudyPage
      info={caseStudyViewModel.metadata}
      sideComponent={
        <ChatClientPage
          className="rounded-lg border"
          conversationID={caseStudyViewModel.conversation.id}
          researchContextID={caseStudyViewModel.researchContext.id}
          researchContextExternalID={caseStudyViewModel.researchContext.externalID}
          listMessagesViewModel={{ status: "request", conversationID: caseStudyViewModel.conversation.id }}
        />
      }
    />
  );
};
