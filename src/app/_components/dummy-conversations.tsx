"use client";
import { ConversationAGGrid } from '@maany_shr/rage-ui-kit';
import type { ConversationRow } from '../[rc_id]/conversations/page';

export const DummyConversation  = (props:  {initialData: ConversationRow[]}) => {
    return (
        <div className="flex flex-col items-stretch">
            
            <ConversationAGGrid
                rowData={props.initialData}
            />
        </div>
    )
}