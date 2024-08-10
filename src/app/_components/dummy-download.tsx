"use client";

import { useState } from "react";

import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import signalsContainer from "~/lib/infrastructure/client/config/ioc/signals-container";
import { type TFileDownloadViewModel } from "~/lib/core/view-models/file-download-view-model";

import type { TSignal } from "~/lib/core/entity/signals";
import { CONTROLLERS, SIGNAL_FACTORY } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type BrowserFileDownloadController from "~/lib/infrastructure/client/controller/browser-file-download-controller";


export const DummyDownloadComponent = () => {

    const [selectedRelativePaths, setSelectedRelativePaths] = useState<string[]>(['', '', '']);


    const [DownloadViewModel, setDownloadViewModel] =
    useState<TFileDownloadViewModel>({
        status: "request",
        message: "File download not started",
    });

    const signalFactory = signalsContainer.get<
        (update: (value: TFileDownloadViewModel) => void) => TSignal<TFileDownloadViewModel>
    >(SIGNAL_FACTORY.KERNEL_FILE_DOWNLOAD);

    const S_KERNEL_FILE_DOWNLOAD_VIEW_MODEL = signalFactory(setDownloadViewModel);

    const handleFileDownload = async () => {
        const strippedPaths = selectedRelativePaths.map(path => path.trim());
        const nonEmptyPaths = strippedPaths.filter(path => path.length > 0);
        if (nonEmptyPaths.length > 0) {
            const fileDownloadController = clientContainer.get<BrowserFileDownloadController>(CONTROLLERS.KERNEL_FILE_DOWNLOAD_CONTROLLER);

            try {
                await fileDownloadController.execute({
                    relativePaths: nonEmptyPaths,
                    response: S_KERNEL_FILE_DOWNLOAD_VIEW_MODEL,
                });
            } catch (error) {
                console.error("File download failed:", error);
            }


        } else {
            console.error("No files selected");
        }
    };




    return (
        <div
          id="file-downloader"
          className="gap-md flex flex-col gap-4"
        >

            <div 
                id="relativePaths-inputter"
                className="flex flex-col gap-2 p-2 border-8 border-purple-100"
            >
                <input
                    id="relativePath-1"            
                    type="text"
                    className="border-4"
                    placeholder="Enter relative path..."
                    onChange={(event) => {
                        const newPaths = [...selectedRelativePaths];
                        newPaths[0] = event.target.value;
                        setSelectedRelativePaths(newPaths);
                    }}
                />
                <input
                    id="relativePath-2"            
                    type="text"
                    className="border-4"
                    placeholder="Enter relative path..."
                    onChange={(event) => {
                        const newPaths = [...selectedRelativePaths];
                        newPaths[1] = event.target.value;
                        setSelectedRelativePaths(newPaths);
                    }}
                />
                <input
                    id="relativePath-3"            
                    type="text"
                    className="border-4"
                    placeholder="Enter relative path..."
                    onChange={(event) => {
                        const newPaths = [...selectedRelativePaths];
                        newPaths[2] = event.target.value;
                        setSelectedRelativePaths(newPaths);
                    }}
                />

            </div>
        
            {
                selectedRelativePaths && (
                    <div
                        id="kp-download-button"
                        className="flex flex-col gap-4 p-4"
                    >
                        <button
                            className={
                                "rounded-md border-2 border-neutral-950 bg-green-500 font-bold text-white transition hover:bg-green-700"
                            }
                            onClick={handleFileDownload}
                        >
                            Download Source Data
                        </button>
                        <div>Files selected: {selectedRelativePaths.join(", ")}</div>
                        <div>Status: {DownloadViewModel.status}</div>
                        <div>Message: {DownloadViewModel.message}</div>
                    </div>
                )
            }

        </div>
    );

};
