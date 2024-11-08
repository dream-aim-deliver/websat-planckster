"use client";

import { SourceDataAGGrid, useToast } from "@maany_shr/rage-ui-kit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Signal } from "~/lib/core/entity/signals";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { DEFAULT_RETRIES, DEFAULT_RETRY_DELAY, downloadSourceMutation, querySources } from "~/app/queries";

export function ListSourceDataForResearchContextClientPage(props: { viewModel: TListSourceDataViewModel; researchContextID: number }) {
  const [downloadSourceDataViewModel, setDownloadSourceDataViewModel] = useState<TFileDownloadViewModel>({
    status: "request",
  } as TFileDownloadViewModel);

  const [listSourceDataViewModel, setListSourceDataViewModel] = useState<TListSourceDataViewModel>(props.viewModel);

  useQueryClient();

  useQuery<Signal<TListSourceDataViewModel>>({
    queryKey: [`list-source-data#${props.researchContextID}`],
    queryFn: querySources(setListSourceDataViewModel, props.researchContextID),
  });

  const downloadMutation = useMutation({
    mutationKey: ["download-source-data"],
    retry: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
    mutationFn: downloadSourceMutation(setDownloadSourceDataViewModel),
  });

  const handleDownloadSourceData = (name: string, relativePath: string) => {
    downloadMutation.mutate({ relativePath: relativePath, sourceFilename: name });
  };

  const { toast } = useToast();

  useEffect(() => {
    if (downloadSourceDataViewModel.status === "error") {
      toast({
        title: "Error downloading the file",
        description: downloadSourceDataViewModel.message,
        variant: "error",
      });
    }
  }, [downloadSourceDataViewModel]);

  useEffect(() => {
    if (listSourceDataViewModel.status === "error") {
      // The timeout makes sure the toast provider is initialized
      setTimeout(() => {
        toast({
          title: `Error fetching sources for research context #${props.researchContextID}`,
          description: listSourceDataViewModel.message,
          variant: "error",
        });
      }, 500);
    }
  }, [downloadSourceDataViewModel]);

  const isSourceDataLoading = listSourceDataViewModel.status === "request";
  const sourceData = listSourceDataViewModel.status === "success" ? listSourceDataViewModel.sourceData : [];
  return <SourceDataAGGrid isLoading={isSourceDataLoading} isUploading={false} enableUpload={false} rowData={sourceData} handleDownloadSourceData={handleDownloadSourceData} handleUploadSourceData={() => {}} />;
}
