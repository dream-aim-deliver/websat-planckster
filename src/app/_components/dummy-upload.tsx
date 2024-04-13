"use client";
import { api } from "~/trpc/react";

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
    const uploadSourceDataMutation = api.sourceData.create.useMutation({
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