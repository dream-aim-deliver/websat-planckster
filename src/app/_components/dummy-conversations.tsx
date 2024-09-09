"use client";
import { ConversationAGGrid } from '@maany_shr/rage-ui-kit';
import type { ConversationRow } from 'node_modules/@maany_shr/rage-ui-kit/dist/components/table/ConversationAGGrid';

export const DummyConversation  = (props:  {initialData: ConversationRow[]}) => {
    return (
        <div className="flex flex-col items-stretch">
            
            <ConversationAGGrid
                rowData={props.initialData}
            />
        </div>
    )
}