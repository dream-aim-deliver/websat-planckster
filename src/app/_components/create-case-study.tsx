"use client";

import { CaseStudyForm, useToast } from "@maany_shr/rage-ui-kit";
import { CaseStudyParameters } from "@maany_shr/rage-ui-kit";
import { useRouter } from "next/navigation";

export const CreateCaseStudy = () => {
  const availableCaseStudies = {
    "climate-monitoring": "Climate Monitoring",
    "sentinel-5p": "Sentinel 5P",
  };

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = (parameters: CaseStudyParameters) => {
    if (!Object.keys(availableCaseStudies).includes(parameters.caseStudy)) {
      toast({
        variant: "error",
        title: "No case study is specified",
        description: "Please choose one of the available case studies.",
      });
      return;
    }

    if (Number.isNaN(parameters.jobId) || parameters.tracerId === "" || parameters.jobId < 0) {
      toast({
        variant: "error",
        title: "Wrong parameters specified",
        description: "Please make sure the job ID and tracer ID fields are not empty.",
      });
      return;
    }

    router.push(`/case-study?jobId=${parameters.jobId}&tracerId=${parameters.tracerId}&caseStudy=${parameters.caseStudy}`);
  };

  return (
    <div className="flex grow items-center justify-center">
      <CaseStudyForm caseStudies={availableCaseStudies} onSubmit={onSubmit} />
    </div>
  );
};
