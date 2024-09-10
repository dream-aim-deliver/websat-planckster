"use client";

import { SourceDataAGGrid } from "@maany_shr/rage-ui-kit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { type Signal } from "~/lib/core/entity/signals";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { type TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import {type TBrowserFileDownloadControllerParameters} from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import type BrowserFileDownloadController from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import BrowserFileUploadController, { TBrowserFileUploadControllerParameters } from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import {type TBrowserListSourceDataControllerParameters} from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";
import type BrowserListSourceDataController from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";

export function ListSourceDataForResearchContextClientPage(
  props: { viewModel: TListSourceDataViewModel; researchContextID: number },
) {

  const [downloadSourceDataViewModel, setDownloadSourceDataViewModel] = useState<TFileDownloadViewModel>({
    status: "request",
  } as TFileDownloadViewModel);

  const [listSourceDataViewModel, setListSourceDataViewModel] = useState<TListSourceDataViewModel>(props.viewModel);

  const queryClient = useQueryClient();

  const { isFetching, isLoading, isError } = useQuery<Signal<TListSourceDataViewModel>>({
    queryKey: [`list-source-data#${props.researchContextID}`],
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
        researchContextID: props.researchContextID,
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
    mutationFn: async (params: {relativePath: string, sourceDataName: string}) => {
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

  const handleDownloadSourceData = (name: string, relativePath: string) => {
    console.log("Download source data", relativePath, name);
    downloadMutation.mutate({relativePath: relativePath, sourceDataName: name});
  };

  const handleUploadSourceData: () => void = () => {console.log("")};


  if (listSourceDataViewModel.status === "request") {
    return (
      <div>
        <SourceDataAGGrid isLoading={true} isUploading={false} enableUpload={false} rowData={[]} handleDownloadSourceData={handleDownloadSourceData} 
        handleUploadSourceData={handleUploadSourceData} />
      </div>
    );
  } else if (listSourceDataViewModel.status === "success") {
    return (
      <div>
        <SourceDataAGGrid isLoading={false} isUploading={false} enableUpload={false} rowData={listSourceDataViewModel.sourceData} handleDownloadSourceData={handleDownloadSourceData} handleUploadSourceData={handleUploadSourceData} />
      </div>
    );
  }
}
