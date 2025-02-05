"use client";

import {useEffect, useRef, useState} from "react";
import { CaseStudyPage, StepProgress } from "@maany_shr/rage-ui-kit";
import type { TCaseStudyViewModel } from "~/lib/core/view-models/case-study-view-model";
import { useMutation } from "@tanstack/react-query";
import { caseStudyMutation, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY } from "~/app/queries";
import { ChatClientPage } from "~/app/_components/chat-page";

type ViewCaseStudyProps = {
  caseStudy: string;
  jobId: number;
  tracerId: string;
};

const PROGRESS_STEPS = 6;

export const ViewCaseStudy = (props: ViewCaseStudyProps) => {
  const [caseStudyViewModel, setCaseStudyViewModel] = useState<TCaseStudyViewModel>({
    status: "request",
    caseStudyName: "",
    tracerID: "",
    jobID: 1,
  } as TCaseStudyViewModel);
  const [step, setStep] = useState(0);

  const createMutation = useMutation({
    mutationKey: ["trigger-case-study"],
    retry: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
    mutationFn: caseStudyMutation(setCaseStudyViewModel),
  });

  const hasCreationStarted = useRef(false);

  useEffect(() => {
    if (!hasCreationStarted.current) {
      createMutation.mutate({
        caseStudyName: props.caseStudy,
        tracerID: props.tracerId,
        jobID: props.jobId,
      });
      hasCreationStarted.current = true;
    }
  }, []);

  useEffect(() => {
    if (caseStudyViewModel.status === "progress") {
      setStep((prev) => prev + 1);
    } else {
      setStep(0)
    }
  }, [caseStudyViewModel]);

  if (caseStudyViewModel.status === "request") {
    return (
      <div className="h-screen w-screen justify-center">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (caseStudyViewModel.status === "progress") {
    return (
      <div className="h-screen w-screen justify-center">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">{caseStudyViewModel.message ?? ""}</h2>
          <StepProgress totalSteps={PROGRESS_STEPS} currentStep={step} />
        </div>
      </div>
    );
  }

  if (caseStudyViewModel.status === "error") {
    return (
      <div className="h-screen w-screen justify-center">
        <div className="rounded-lg bg-red-800 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Error!</h2>
          <p>{caseStudyViewModel.message ?? ""}</p>
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
