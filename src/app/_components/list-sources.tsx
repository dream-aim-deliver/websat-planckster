"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { TListSourceDataViewModel } from "~/lib/core/view-models/list-source-data-view-models";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import type BrowserListSourceDataController from "~/lib/infrastructure/client/controller/browser-list-source-data-controller";
import { CONTROLLERS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import { TSignal } from "~/lib/core/entity/signals";
import type { RemoteFile } from "~/lib/core/entity/file";
import type BrowserFileDownloadController from "~/lib/infrastructure/client/controller/browser-file-download-controller";
import type { TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";
import { SourceDataAGGrid } from "@maany_shr/rage-ui-kit";
export type ListSourceDataPageProps = {
  initialData: TListSourceDataViewModel;
};
export function ListSourcesForClientPage(props: ListSourceDataPageProps) {
    const [sourceData, setSourceData] = useState<TListSourceDataViewModel>(props.initialData);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [fileDownloadViewModel, setFileDownloadViewModel] = useState<TFileDownloadViewModel>({
        status: "request",
        message: "Initiating download...",
    });
    const [fileDownloadProgress, setFileDownloadProgress] = useState<number>(0);

    const handleFileDownloadStatus = (update: TFileDownloadViewModel) => {
        setFileDownloadViewModel(update)
        const updatedFileDownloadViewModel = fileDownloadViewModel
        if(updatedFileDownloadViewModel.status === "success") {
            console.log("Downloaded file", updatedFileDownloadViewModel)
        } else if (updatedFileDownloadViewModel.status === "error") {
            console.log("Error downloading file", updatedFileDownloadViewModel)
        } else if (updatedFileDownloadViewModel.status === "request") {
            // Do nothing       
        } else if (updatedFileDownloadViewModel.status === "progress") {
            setFileDownloadProgress(updatedFileDownloadViewModel.progress)
        } else if (updatedFileDownloadViewModel.status === "partial") {
            // Add toast
        }
    }
    const { isLoading, isError } = useQuery<void>({
        queryKey: ["list-sources"],
        queryFn: async () => {
            const controller = clientContainer.get<BrowserListSourceDataController>(CONTROLLERS.LIST_SOURCE_DATA_CONTROLLER)
            const viewModel = new TSignal<TListSourceDataViewModel>(
                "ListSourceDataViewModel",
                "Lists source data for a client",
                {
                    status: "request",
                },
                setSourceData
            )
            console.log("viewModel", viewModel)
            await controller.execute({
                response: viewModel,
            })
        },
        refetchOnMount: !sourceData,
    })

    const onDownload = (files: RemoteFile[]) => {
        setIsDownloading(true)
        const fileDownloadController = clientContainer.get<BrowserFileDownloadController>(CONTROLLERS.KERNEL_FILE_DOWNLOAD_CONTROLLER)
        for (const file of files) {
            const S_FileDownloadViewModel = new TSignal<TFileDownloadViewModel>(
                "FileDownloadViewModel",
                "Downloads a file",
                {
                    status: "request",
                    message: "Initiating download...",
                },
                handleFileDownloadStatus
            )
            const sourceDataBasicInformationList = files.map((file) => {
                return {
                    id: file.id,
                    name: file.name,
                    relativePath: file.relativePath,
                    createdAt: file.createdAt,
                }
            })
            fileDownloadController.execute({
                sourceDataBasicInformationList: sourceDataBasicInformationList,
                response:  S_FileDownloadViewModel
            })
            .then(() => {
                // TODO: Add Toast
                console.log("Downloaded file", file)
            })
            .catch((error) => {
                // TODO: Add Toast
                console.error("Error downloading file", file, error)
            })
            .finally(() => {
                setIsDownloading(false)
            })
        }
    }

    if(sourceData.status === "error") {
        return <div>Error: {sourceData.message}</div>
    }
    if( sourceData.status === "request") {
        return <div>Loading...</div>
    }
    return (
        <div className="flex flex-col items-center justify-between gap-4">
            {/* <UIKitComponent sourceData={sourceData} isLoading={isLoading} onDownload={onDownload}/> */}
            <div className="text-2xl font-bold">List of source data</div>
            <SourceDataAGGrid 
                rowData={sourceData.sourceData}
                isLoading={isLoading}
                download= {{
                    isDownloading: isDownloading,
                    progress: fileDownloadProgress,
                    onDownload: onDownload,
                }}
            />
        </div>
    )
}

interface UIKitComponentProps {
    sourceData: TListSourceDataViewModel;
    isLoading: boolean;
    onDownload: (files: RemoteFile[]) => void;
}

const UIKitComponent = (props: UIKitComponentProps) => {
    if(props.isLoading) {
        console.log("Loading...")
        return <div>Loading...</div>
    }
    return (
        <div>
            {props.isLoading && <div>Loading...</div>}
            {JSON.stringify(props.sourceData)}
        </div>
    )
}