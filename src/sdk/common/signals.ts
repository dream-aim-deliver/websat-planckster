import type { Signal } from '@preact/signals-react';

/**
 * Represents a signal with a name, description, and data.
 * The data is a signal from the signals-react library.
 * THIS CAN BE USED BOTH ON THE CLIENT AND SERVER SIDE.
 * @template TData - The type of data associated with the signal.
 */
export interface TSignal<TData> {
    name: string;
    description: string;
    data: Signal<TData>;
}
