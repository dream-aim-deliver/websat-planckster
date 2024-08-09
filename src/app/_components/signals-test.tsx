"use client";
import { effect, signal } from "@preact/signals-react";
import "@preact/signals-react/auto";
import { useState } from "react";

export default function SignalsTest() {
    // useSignals();
    
    const data = {
        value: signal<{
            success: boolean;
            data: string;
        }>({
            success: false,
            data: "Hello",
        }),
    };
   
    return (
        <div>
            <h1>Signals Test: {data.value.value.data}</h1>
            <button
                onClick={() => {
                    data.value.value = {
                        success: !data.value.value.success,
                        data: "Data Changed",
                    };
                    console.log(data.value.value.data);  
                }}
            >
                Change
            </button>
        </div>
    );
}
