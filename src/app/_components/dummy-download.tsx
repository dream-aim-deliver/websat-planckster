"use client";

import { api } from "~/lib/infrastructure/client/trpc/react";

export type DummyDownloadProps = {
    clientId: number,
    protocol: string,
    xAuthToken: string,
    relativePath: string,
    localFilePath: string,
};

export function DummyDownloadComponent(
    props: DummyDownloadProps
) {
    const downloadSourceDataMutation = api.sourceData.download.useMutation({
        onSuccess: () => {
            console.log("Source data downloaded");
        },
    });

    return (
        <div>
            <button
                onClick={() => {
                    downloadSourceDataMutation.mutate({
                        clientId: props.clientId,
                        protocol: props.protocol,
                        xAuthToken: props.xAuthToken,
                        relativePath: props.relativePath,
                        localFilePath: props.localFilePath,
                    });
                }}
            >
                Download Source Data
            </button>
            {downloadSourceDataMutation.isError && (
                <div>Error: {JSON.stringify(downloadSourceDataMutation.error)}</div>
            )}
        </div>
    );
}
