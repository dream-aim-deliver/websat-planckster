import "reflect-metadata";

import { Container, type interfaces } from "inversify";
import type { TSignal } from "~/lib/core/entity/signals";
import { SIGNALS } from "./client-ioc-symbols";
import type { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import { signal } from "@preact/signals-react";

const signalsContainer = new Container();

signalsContainer.bind<TSignal<TFileUploadingViewModel>>(SIGNALS.KERNEL_FILE_UPLOAD).toDynamicValue((context: interfaces.Context) => {
  return {
    name: `Kernel File Upload ${new Date().getTime()}`,
    description: "Signal for updating view models for kernel file uploading on the client side",
    value: signal<TFileUploadingViewModel>({
      status: "request",
      message: "File upload not started",
    }),
  };
});


export default signalsContainer;