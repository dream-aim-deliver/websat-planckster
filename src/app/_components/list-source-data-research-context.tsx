"use client";

import { SourceDataAGGrid } from "@maany_shr/rage-ui-kit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type Signal } from "~/lib/core/entity/signals";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { downloadSourceMutation, querySources } from "~/app/queries";

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
    retry: 3,
    retryDelay: 3000,
    mutationFn: downloadSourceMutation(setDownloadSourceDataViewModel),
  });

  const handleDownloadSourceData = (name: string, relativePath: string) => {
    downloadMutation.mutate({ relativePath: relativePath, sourceFilename: name });
  };

  const isSourceDataLoading = listSourceDataViewModel.status === "request";
  const sourceData = listSourceDataViewModel.status === "success" ? listSourceDataViewModel.sourceData : [];
  return <SourceDataAGGrid isLoading={isSourceDataLoading} isUploading={false} enableUpload={false} rowData={sourceData} handleDownloadSourceData={handleDownloadSourceData} handleUploadSourceData={() => {}} />;
}
