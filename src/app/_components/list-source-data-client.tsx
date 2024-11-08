"use client";

import { SourceDataAGGrid, useToast } from "@maany_shr/rage-ui-kit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { type Signal } from "~/lib/core/entity/signals";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { type TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import { DEFAULT_RETRIES, DEFAULT_RETRY_DELAY, downloadSourceMutation, querySources, uploadSourceMutation } from "~/app/queries";

export function ListSourceDataForClientClientPage(props: { viewModel: TListSourceDataViewModel; clientID: string }) {
  const [uploadSourceDataViewModel, setUploadSourceDataViewModel] = useState<TFileUploadViewModel>({
    status: "request",
  } as TFileUploadViewModel);

  const [downloadSourceDataViewModel, setDownloadSourceDataViewModel] = useState<TFileDownloadViewModel>({
    status: "request",
  } as TFileDownloadViewModel);

  const [listSourceDataViewModel, setListSourceDataViewModel] = useState<TListSourceDataViewModel>(props.viewModel);

  const queryClient = useQueryClient();

  useQuery<Signal<TListSourceDataViewModel>>({
    queryKey: ["list-source-data"],
    queryFn: querySources(setListSourceDataViewModel),
  });

  const downloadMutation = useMutation({
    mutationKey: ["download-source-data"],
    retry: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
    mutationFn: downloadSourceMutation(setDownloadSourceDataViewModel),
  });

  const uploadMutation = useMutation({
    mutationKey: ["upload-source-data"],
    retry: DEFAULT_RETRIES,
    retryDelay: DEFAULT_RETRY_DELAY,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["list-source-data"] });
    },
    mutationFn: uploadSourceMutation(setUploadSourceDataViewModel),
  });

  const handleDownloadSourceData = (name: string, relativePath: string) => {
    downloadMutation.mutate({ relativePath: relativePath, sourceFilename: name });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadSourceData = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset the input's state to enable repeated upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      uploadMutation.mutate({ file, clientID: props.clientID });
    }
  };

  const { toast } = useToast();

  useEffect(() => {
    if (uploadSourceDataViewModel.status === "error") {
      toast({
        title: "Error uploading the file",
        description: uploadSourceDataViewModel.message,
        variant: "error",
      });
    }
  }, [uploadSourceDataViewModel]);

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
          title: "Error fetching sources",
          description: listSourceDataViewModel.message,
          variant: "error",
        });
      }, 500);
    }
  }, [downloadSourceDataViewModel]);

  const isUploading = uploadMutation.isPending;
  const areSourcesLoading = listSourceDataViewModel.status === "request";
  const rowData = listSourceDataViewModel.status === "success" ? listSourceDataViewModel.sourceData : [];
  return (
    <>
      <SourceDataAGGrid rowData={rowData} isLoading={areSourcesLoading} isUploading={isUploading} enableUpload={true} handleDownloadSourceData={handleDownloadSourceData} handleUploadSourceData={handleUploadSourceData} />
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
    </>
  );
}
