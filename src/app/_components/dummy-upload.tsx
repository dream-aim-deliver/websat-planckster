"use client";

import { useSignals } from "@preact/signals-react/runtime";
import { useState } from "react";
import { type TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import signalsContainer from "~/lib/infrastructure/client/config/ioc/signals-container";
import { CONTROLLERS, SIGNALS } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type BrowserFileUploadController from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import { TSignal } from "~/lib/core/entity/signals";


export const DummyUploadComponent = () => {
 
    useSignals();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localFilePath, setLocalFilePath] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setSelectedFile(file);
        setLocalFilePath(URL.createObjectURL(file));
    }}

    const fileUploadingController = clientContainer.get<BrowserFileUploadController>(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER);

    const S_KERNEL_FILE_UPLOAD_VIEW_MODEL = signalsContainer.get<TSignal<TFileUploadingViewModel>>(SIGNALS.KERNEL_FILE_UPLOADING);

    return (
        <div className="flex flex-row gap-md">

            <div id="file-selector">
                <input type="file" id="file-selector" name="file-selector" onChange={handleFileChange} />

                {
                !localFilePath && (
                    <div>
                        <p>Please select a file to upload</p>
                        <button className={"border-2 border-neutral-950 text-gray-400 rounded-md"} disabled={true}>Upload Source Data</button>
                    </div>
                )}

                {localFilePath && (
                    <div id="kp-upload-button">
                        <button
                            className={"border-2 border-neutral-950 rounded-md"} 
                            onClick={() => {
                                if (selectedFile) {
                                    fileUploadingController.execute({
                                        file: selectedFile,
                                        response: S_KERNEL_FILE_UPLOAD_VIEW_MODEL,
                                    })
                                    .then(() => {
                                    console.log("File uploaded");
                                    console.log(S_KERNEL_FILE_UPLOAD_VIEW_MODEL.value.value);
                                    })
                                    .catch((error) => {
                                    console.error(error);
                                    });
                                } else {
                                    console.error("No file selected");
                                }
                            }}
                        >
                            Upload Source Data
                        </button>

                        <div>
                            <p>Status: {S_KERNEL_FILE_UPLOAD_VIEW_MODEL.value.value.status}</p>
                            <p>Message: {S_KERNEL_FILE_UPLOAD_VIEW_MODEL.value.value.message}</p>
                        </div>

                        <div>File selected: {localFilePath}</div>

                    </div> 
                )} 

            </div>


        </div>

)}