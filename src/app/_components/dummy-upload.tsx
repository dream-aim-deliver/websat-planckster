"use client";

import { useSignals } from "@preact/signals-react/runtime";
import { useState } from "react";
import { type TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import signalsContainer from "~/lib/infrastructure/client/config/ioc/signals-container";
import {
  CONTROLLERS,
  SIGNALS,
} from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type BrowserFileUploadController from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import type { TSignal } from "~/lib/core/entity/signals";

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
    }
  };

  const fileUploadingController =
    clientContainer.get<BrowserFileUploadController>(
      CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER,
    );

  const S_KERNEL_FILE_UPLOAD_VIEW_MODEL = signalsContainer.get<
    TSignal<TFileUploadingViewModel>
  >(SIGNALS.KERNEL_FILE_UPLOAD);

  return (
    <div
      id="file-selector"
      className="gap-md flex flex-col gap-4 border border-x-lime-500 p-4 shadow-lg"
    >
      <input
        type="file"
        id="file-selector"
        name="file-selector"
        onChange={handleFileChange}
      />

      {!localFilePath && (
        <div className="flex flex-col gap-2 border border-blue-500 p-4 rounded-md bg-stone-100">
          <p>Please select a file to upload</p>
          <button
            className={"rounded-md border-2 border-neutral-950 text-gray-400"}
            disabled={true}
          >
            Upload Source Data
          </button>
        </div>
      )}

      {localFilePath && (
        <div id="kp-upload-button" className="flex flex-col p-4 gap-4">
          <button
            className={"rounded-md border-2 border-neutral-950 bg-green-500 transition hover:bg-green-700 text-white font-bold"}
            onClick={() => {
              if (selectedFile) {
                fileUploadingController
                  .execute({
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

          <div className="flex flex-col items-start border border-lime-600 p-4 gap-4">
            <p>Status: {S_KERNEL_FILE_UPLOAD_VIEW_MODEL.value.value.status}</p>
            <p>
              Message: {S_KERNEL_FILE_UPLOAD_VIEW_MODEL.value.value.message}
            </p>
          </div>

          <div>File selected: {localFilePath}</div>
        </div>
      )}
    </div>
  );
};
