"use client";

import { useState } from "react";
import { type TFileUploadViewModel } from "~/lib/core/view-models/file-upload-view-model";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import signalsContainer from "~/lib/infrastructure/common/signals-container";
import {
  CONTROLLERS,
} from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import type BrowserFileUploadController from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import type { Signal } from "~/lib/core/entity/signals";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/common/signals-ioc-container";

export const DummyUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [UploadViewModel, setUploadViewModel] = useState<TFileUploadViewModel>({
    status: "request",
    message: "File upload not started",
  });
  const signalFactory = signalsContainer.get<(update: (value: TFileUploadViewModel) => void, initialValue: TFileUploadViewModel ) => Signal<TFileUploadViewModel>
  >(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD);

  const S_KERNEL_FILE_UPLOAD_VIEW_MODEL = signalFactory(setUploadViewModel, {
    status: "request",
    message: "File upload not started",
  } );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];

      if (!file) {
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const handleFileUpload = () => {
    if (selectedFile) {
      const fileUploadingController = clientContainer.get<BrowserFileUploadController>(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER);
      fileUploadingController.execute({ file: selectedFile, response: S_KERNEL_FILE_UPLOAD_VIEW_MODEL })
        .then(() => {
          console.log(S_KERNEL_FILE_UPLOAD_VIEW_MODEL.value);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No file selected");
    }
  };


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

      {selectedFile && (
        <div id="kp-upload-button" className="flex flex-col gap-4 p-4">
          <button
            className={
              "rounded-md border-2 border-neutral-950 bg-green-500 font-bold text-white transition hover:bg-green-700"
            }
            onClick={handleFileUpload}
          >
            Upload Source Data
          </button>

          <div>File selected: {selectedFile.name}</div>

          <UIKitComponent {...UploadViewModel} />
        </div>
      )}
    </div>
  );
};

const UIKitComponent = (props: { status: string, message: string }) => {
  return (
    <div className="flex flex-col items-start gap-4 border border-lime-600 p-4">
      {props.status}
      {props.message}
    </div>
  );
};
