"use client";

export type DummyDownloadProps = {
    protocol: string,
    relativePath: string,
    localFilePath: string,
};

export function DummyDownloadComponent(
    //props: DummyDownloadProps
) {
    //const api = clientContainer.get<TClientComponentAPI>(TRPC.REACT_CLIENT_COMPONENTS_API);

    return (
        <div>
            <button
            >
                Download Source Data
            </button>
        </div>
    );
}
