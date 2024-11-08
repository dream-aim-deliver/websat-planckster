"use client";

import { SourceDataAGGrid } from "@maany_shr/rage-ui-kit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { type Signal } from "~/lib/core/entity/signals";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { type TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import { type TBrowserFileDownloadControllerParameters } from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import type BrowserFileDownloadController from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import { type TBrowserFileUploadControllerParameters } from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import type BrowserFileUploadController from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import { type TBrowserListSourceDataControllerParameters } from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";
import type BrowserListSourceDataController from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";

export function ListSourceDataForClientClientPage(props: { viewModel: TListSourceDataViewModel; clientID: string }) {
  const [uploadSourceDataViewModel, setUploadSourceDataViewModel] = useState<TFileUploadViewModel>({
    status: "request",
  } as TFileUploadViewModel);

  const [downloadSourceDataViewModel, setDownloadSourceDataViewModel] = useState<TFileDownloadViewModel>({
    status: "request",
  } as TFileDownloadViewModel);

  const [listSourceDataViewModel, setListSourceDataViewModel] = useState<TListSourceDataViewModel>(props.viewModel);

  const queryClient = useQueryClient();

  const { isLoading: isSourceDataLoading } = useQuery<Signal<TListSourceDataViewModel>>({
    queryKey: ["list-source-data"],
    queryFn: async () => {
      const signalFactory = signalsContainer.get<(initialValue: TListSourceDataViewModel, update?: (value: TListSourceDataViewModel) => void) => Signal<TListSourceDataViewModel>>(SIGNAL_FACTORY.KERNEL_LIST_SOURCE_DATA);
      const response: Signal<TListSourceDataViewModel> = signalFactory(
        {
          status: "request",
        },
        setListSourceDataViewModel,
      );
      const controllerParameters: TBrowserListSourceDataControllerParameters = {
        response: response,
      };
      const controller = clientContainer.get<BrowserListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  const downloadMutation = useMutation({
    mutationKey: ["download-source-data"],
    retry: 3,
    retryDelay: 3000,
    mutationFn: async (params: { relativePath: string; sourceDataName: string }) => {
      const signalFactory = signalsContainer.get<(initialValue: TFileDownloadViewModel, update?: (value: TFileDownloadViewModel) => void) => Signal<TFileDownloadViewModel>>(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD);
      const response: Signal<TFileDownloadViewModel> = signalFactory(
        {
          status: "request",
        } as TFileDownloadViewModel,
        setDownloadSourceDataViewModel,
      );
      const controllerParameters: TBrowserFileDownloadControllerParameters = {
        response: response,
        relativePath: params.relativePath,
        localPath: params.sourceDataName,
      };
      const controller = clientContainer.get<BrowserFileDownloadController>(CONTROLLERS.KERNEL_FILE_DOWNLOAD_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  const uploadMutation = useMutation({
    mutationKey: ["upload-source-data"],
    retry: 3,
    retryDelay: 3000,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["list-source-data"] });
    },
    mutationFn: async (file: File) => {
      const signalFactory = signalsContainer.get<(initialValue: TFileUploadViewModel, update?: (value: TFileUploadViewModel) => void) => Signal<TFileUploadViewModel>>(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD);
      const response: Signal<TFileUploadViewModel> = signalFactory(
        {
          status: "request",
        } as TFileUploadViewModel,
        setUploadSourceDataViewModel,
      );
      const controllerParameters: TBrowserFileUploadControllerParameters = {
        response: response,
        file: file,
        clientID: props.clientID,
      };
      const controller = clientContainer.get<BrowserFileUploadController>(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER);
      await controller.execute(controllerParameters);
      return response;
    },
  });

  const handleDownloadSourceData = (name: string, relativePath: string) => {
    console.log("Download source data", relativePath, name);
    downloadMutation.mutate({ relativePath: relativePath, sourceDataName: name });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadSourceData = () => {
    console.log("Upload source data");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      uploadMutation.mutate(file);
    }
  };

  const isUploading = uploadMutation.isPending;
  const rowData = listSourceDataViewModel.status === "success" ? listSourceDataViewModel.sourceData : [];
  return <>
    <SourceDataAGGrid rowData={rowData} isLoading={isSourceDataLoading} isUploading={isUploading}
                      enableUpload={true} handleDownloadSourceData={handleDownloadSourceData}
                      handleUploadSourceData={handleUploadSourceData}/>
    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange}/>
  </>
}
