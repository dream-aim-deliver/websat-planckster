"use client";

import { CaseStudyForm, useToast } from "@maany_shr/rage-ui-kit";
import { CaseStudyParameters } from "@maany_shr/rage-ui-kit";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { useQuery } from "@tanstack/react-query";
import type { Signal } from "~/lib/core/entity/signals";
import { querySources } from "~/app/queries";

const METADATA_SOURCE_EXP = /^([^/]+)\/([^/]+)\/(\d+)\/metadata\.json$/;

export const CreateCaseStudy = (props: { initialViewModel: TListSourceDataViewModel }) => {
  const availableCaseStudies = {
    "climate-monitoring": "Climate Monitoring",
    "sentinel-5p": "Sentinel 5P",
    "swiss-grid": "Swiss Grid",
  };

  const [parameters, setParameters] = useState<CaseStudyParameters>({
    caseStudy: undefined,
    tracerId: undefined,
    jobId: undefined,
  });

  const { toast } = useToast();
  const router = useRouter();

  const [listSourceDataViewModel, setListSourceDataViewModel] = useState<TListSourceDataViewModel>(props.initialViewModel);

  useQuery<Signal<TListSourceDataViewModel>>({
    queryKey: ["list-source-data"],
    queryFn: querySources(setListSourceDataViewModel),
    refetchOnWindowFocus: false,
  });

  const onSubmit = () => {
    if (!parameters.caseStudy || !Object.keys(availableCaseStudies).includes(parameters.caseStudy)) {
      toast({
        variant: "error",
        title: "No case study is specified",
        description: "Please choose one of the available case studies.",
      });
      return;
    }

    if (!parameters.jobId || !parameters.tracerId || Number.isNaN(parameters.jobId) || parameters.tracerId === "" || parameters.jobId < 0) {
      toast({
        variant: "error",
        title: "Wrong parameters specified",
        description: "Please make sure the job ID and tracer ID fields are not empty.",
      });
      return;
    }

    router.push(`/case-study?jobId=${parameters.jobId}&tracerId=${parameters.tracerId}&caseStudy=${parameters.caseStudy}`);
  };

  const getTracerIds = () => {
    if (listSourceDataViewModel.status !== "success") return undefined;
    if (!parameters.caseStudy) return undefined;
    const tracerIds = new Set<string>();

    for (const source of listSourceDataViewModel.sourceData) {
      const match = source.relativePath.match(METADATA_SOURCE_EXP);

      if (match) {
        const caseStudy = match[1];
        if (caseStudy !== parameters.caseStudy) continue;
        const tracerId = match[2];
        if (!tracerId) continue;
        tracerIds.add(tracerId);
      }
    }

    return Array.from(tracerIds);
  };

  const getJobIds = () => {
    if (listSourceDataViewModel.status !== "success") return undefined;
    if (!parameters.caseStudy || !parameters.tracerId) return undefined;
    const jobIds = new Set<number>();

    for (const source of listSourceDataViewModel.sourceData) {
      const match = source.relativePath.match(METADATA_SOURCE_EXP);

      if (match) {
        const caseStudy = match[1];
        if (caseStudy !== parameters.caseStudy) continue;
        const tracerId = match[2];
        if (tracerId !== parameters.tracerId) continue;
        const jobId = match[3];
        if (!jobId) continue;
        jobIds.add(parseInt(jobId));
      }
    }

    return Array.from(jobIds);
  };

  if (listSourceDataViewModel.status === "request") {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex grow items-center justify-center">
      <CaseStudyForm
          parameters={parameters}
          setParameters={setParameters}
          caseStudies={availableCaseStudies}
          onSubmit={onSubmit} jobIds={getJobIds()}
          tracerIds={getTracerIds()}
      />
    </div>
  );
};
