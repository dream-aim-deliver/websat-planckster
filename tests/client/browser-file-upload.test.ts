import { TSignal } from "~/lib/core/entity/signals";
import { TFileUploadingViewModel } from "~/lib/core/view-models/file-upload-view-model";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import { CONTROLLERS, REPOSITORY, TRPC } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import signalsContainer from "~/lib/infrastructure/client/config/ioc/signals-container";
import { SIGNAL_FACTORY } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";
import BrowserFileUploadController from "~/lib/infrastructure/client/controller/browser-file-upload-controller";
import KernelFileClientRepository from "~/lib/infrastructure/client/repository/kernel-remote-storage-element";
import { TVanillaAPI } from "~/lib/infrastructure/client/trpc/vanilla-api";
import axios from "axios";
import { create } from "domain";


describe('Kernel Planckster File Repository ', () => {

  it('should upload a file', async () => {
    jest.spyOn(clientContainer.get<KernelFileClientRepository>(REPOSITORY.KERNEL_FILE_REPOSITORY), "uploadFile").mockResolvedValue({
      success: true,
      data: {
        provider: 'test',
        type: "remote",
        "path": "user-uploads/potato.tsx",
      }
    })

    // TODO: figure out how to mock the trpc client
    // https://github.com/maloguertin/msw-trpc
    // jest.mock(clientContainer.get<TVanillaAPI>(TRPC.VANILLA_CLIENT)).mockResolvedValue({
    //   kernel: {
    //   sources: {
    //     create: {
    //       mutate: jest.fn().mockResolvedValue({
    //         success: true,
    //         data: {
    //           provider: 'test',
    //           type: "remote",
    //           "path": "user-uploads/potato.tsx",
    //         }
    //       })
    //     }
    //   }
    // }
    // })


    // const browserFileUploadController = clientContainer.get<BrowserFileUploadController>(CONTROLLERS.KERNEL_FILE_UPLOAD_CONTROLLER)
    // const file = new File(['hey', 'this', 'is', 'a', 'potato'], 'potato.tsx', { type: 'text/plain' })
    // const signalFactory = signalsContainer.get<
    //   (update: (value: TFileUploadingViewModel) => void) => TSignal<TFileUploadingViewModel>
    // >(SIGNAL_FACTORY.KERNEL_FILE_UPLOAD);

    // const S_VIEW_MODEL = signalFactory((value: TFileUploadingViewModel) => {
    //   console.log(value)
    // });

    // await browserFileUploadController.execute({
    //   file: file,
    //   response: S_VIEW_MODEL,
    // })
    // expect(S_VIEW_MODEL.value.status).toBe('success')

  });
});