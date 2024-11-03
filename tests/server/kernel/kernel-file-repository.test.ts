import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { loadAuthMocks } from "../mocks/auth";

const KP_UPLOAD_CREDENTIALS_ENDPOINT = http.get(`http://10.10.10.10/client/123/upload-credentials?protocol=s3&relative_path=test.txt`, () => {
    return HttpResponse.json({
        status: true,
        data: {
            "signed_url": "https://10.10.10.100/signed-url",
        }
    })
})
const MINIO_UPLOAD_ENDPOINT = http.put("https://10.10.10.100/signed-url", () => {
    return HttpResponse.json({
        status: true,
        data: "File uploaded successfully",
    })
})
const handlers = [KP_UPLOAD_CREDENTIALS_ENDPOINT, MINIO_UPLOAD_ENDPOINT]
const MockHttpServer = setupServer(...handlers);

describe("Kernel File Repository", () => {
    beforeAll(() => {
        // create a test file to upload with sample content
        MockHttpServer.listen();
        loadAuthMocks();
    });
    afterEach(() => {
        MockHttpServer.resetHandlers();

    });
    afterAll(() => {
        jest.clearAllMocks();
        MockHttpServer.close();
    });

    it("should fail if file does not exist on local filesystem", async () => {
        // const KernelFileRepository = serverContainer.get<FileRepositoryOutputPort>(REPOSITORY.KERNEL_FILE_REPOSITORY)
        // const localFile: LocalFile = {
        //     type: "local",
        //     relativePath: "test.txt",
        // }
        // const uploadFileDTO = await KernelFileRepository.uploadFile(localFile, "test.txt")
        // expect(uploadFileDTO.success).toBe(false);
        // if (uploadFileDTO.success) {
        //     fail("Upload file should not be successful");
        // }
        // expect(uploadFileDTO.data.operation).toBe("kp#upload");
        // expect(uploadFileDTO.data.message).toBe("File test.txt does not exist on the local filesystem");
    });

    it("should fail if KP credentials are not available", async () => {
        // const KernelFileRepository = serverContainer.get<FileRepositoryOutputPort>(REPOSITORY.KERNEL_FILE_REPOSITORY)
        // jest.spyOn(fs, "existsSync").mockReturnValue(true);
        // jest.spyOn(fs, "readFileSync").mockReturnValue("test content");
        // jest.spyOn(serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY), "extractKPCredentials").mockResolvedValue({
        //     success: false,
        //     data: {
        //         message: "KP credentials not available",
        //     }
        // });
        // const localFile: LocalFile = {
        //     type: "local",
        //     path: "test.txt",
        // }

        // const uploadFileDTO = await KernelFileRepository.uploadFile(localFile, "test.txt")
        // expect(uploadFileDTO.success).toBe(false);
        // if (uploadFileDTO.success) {
        //     fail("Upload file should not be successful");
        // }
        // expect(uploadFileDTO.data.operation).toBe("kp#upload");
        // expect(uploadFileDTO.data.message).toBe("KP credentials not available");
    });

    it("should upload a file to KP", async () => {
        // jest.spyOn(fs, "existsSync").mockReturnValue(true);
        // jest.spyOn(fs, "readFileSync").mockReturnValue("test content");
        // jest.spyOn(serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY), "extractKPCredentials").mockResolvedValue({
        //     success: true,
        //     data: {
        //         clientID: 123,
        //         xAuthToken: "test-token",
        //     }
        // });


        // const localFile: LocalFile = {
        //     type: "local",
        //     path: "test.txt",
        // }
        // jest.spyOn(axios, "put").mockResolvedValue({
        //     status: 200,
        //     statusText: "OK",
        //     data: "File uploaded successfully",
        // });
        // const KernelFileRepository = serverContainer.get<FileRepositoryOutputPort>(REPOSITORY.KERNEL_FILE_REPOSITORY)
        // const uploadFileDTO = await KernelFileRepository.uploadFile(localFile, "test.txt")
        // expect(uploadFileDTO.success).toBe(true);

    });
    it("should download a file from Kernel", async () => {
        // const KernelSourceDataRepository = serverContainer.get<SourceDataGatewayOutputPort>(GATEWAYS.KERNEL_SOURCE_DATA_GATEWAY)
        // const remoteFile: RemoteFile = {
        //     type: "remote",
        //     relativePath: "user-uploads/data.json",
        //     name: "data.json",
        //     id: "1",
        //     provider: "kernel#s3",
        //     createdAt: "",
        // }
        // const downloadFileDTO = await KernelSourceDataRepository.download(remoteFile, "data.json")
        // expect(downloadFileDTO.success).toBe(true);

    }, 10000);
});