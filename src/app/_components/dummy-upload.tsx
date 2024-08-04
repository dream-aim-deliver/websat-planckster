"use client";
import clientContainer from "~/lib/infrastructure/client/config/ioc/client-container";
import type { TClientComponentAPI } from "~/lib/infrastructure/client/trpc/react-api";
import { TRPC } from "~/lib/infrastructure/client/config/ioc/client-ioc-symbols";

export type DummyUploadProps = {
    clientId: number,
    protocol: string,
    xAuthToken: string,
    relativePath: string,
    sourceDataName: string,
    localFilePath: string,
};

export function DummyUploadComponent(
    props: DummyUploadProps
) {
    const api = clientContainer.get<TClientComponentAPI>(TRPC.REACT_CLIENT_COMPONENTS_API);
    const uploadSourceDataMutation = api.kernel.sourceData.create.useMutation({
        onSuccess: () => {
            console.log("Source data uploaded");
        },
    });

    return (
        <div>
            <button
                onClick={() => {
                    uploadSourceDataMutation.mutate({
                        clientId: props.clientId,
                        protocol: props.protocol,
                        xAuthToken: props.xAuthToken,
                        relativePath: props.relativePath,
                        sourceDataName: props.sourceDataName,
                        localFilePath: props.localFilePath,
                    });
                }}
            >
                Upload Source Data
            </button>
            {uploadSourceDataMutation.isError && (
                <div>Error: {JSON.stringify(uploadSourceDataMutation.error)}</div>
            )}
        </div>
    );
}