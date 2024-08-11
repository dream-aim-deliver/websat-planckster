"use client";

import type { RemoteFile } from "~/lib/core/entity/file";

export interface OpenAIClientProps {
    files: RemoteFile[];
}
export const OpenAIClientComponent = (props: OpenAIClientProps) => {
    return (
        <div className="flex flex-col items-center justify-between">
            {props.files.map((file) => (
                <div key={file.relativePath} className={[
                    "flex flex-row items-center justify-between",
                    "border border-gray-300 rounded-md p-2",
                    "w-1/2",
                    "mb-2 text-sm"
                    ].join(" ")
                }>
                    <p>{file.name}</p>
                    <p>{file.relativePath}</p>
                </div>
            ))}
            This is the client side of the OpenAI client.

        </div>
    )
};