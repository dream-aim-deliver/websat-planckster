"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { TCaseStudyViewModel } from "~/lib/core/view-models/case-study-view-model";
import { caseStudyMutation, DEFAULT_RETRIES, DEFAULT_RETRY_DELAY } from "../queries";

export function DummyCaseStudyEnter() {
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
    onSuccess: async () => {
      alert("Case study created successfully");
    },
    mutationFn: caseStudyMutation(setCaseStudyViewModel),
  });

  function onSubmitHandlerForMutation() {
    createMutation.mutate({
      caseStudyName: "climate-monitoring",
      tracerID: "test",
      jobID: 1,
    });
  }

  return (
    <div className="flex flex-col gap-large">
      <div className="">
        <button type="submit" onClick={onSubmitHandlerForMutation} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
          Submit
        </button>
      </div>

      {caseStudyViewModel.status === "success" && (
        <div>
          <div>Case study created successfully</div>
          <div>Research Context title: {caseStudyViewModel.researchContext.title}</div>
          <div>Conversation title: {caseStudyViewModel.conversation.title}</div>
          <div>Recovered case study name: {caseStudyViewModel.keyframeArray.caseStudy}</div>
        </div>
      )}
    </div>
  );
}
