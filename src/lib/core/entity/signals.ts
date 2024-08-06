import { type Signal } from "@preact/signals-react";


export interface TSignal<TValue> {
    name: string;
    description: string;
    value: Signal<TValue>;
}