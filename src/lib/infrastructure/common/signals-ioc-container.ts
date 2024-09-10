import { KERNEL } from "../server/config/ioc/server-ioc-symbols";

export const SIGNAL_FACTORY = {
    CREATE_RESEARCH_CONTEXT: Symbol("CREATE_RESEARCH_CONTEXT"),
    LIST_RESEARCH_CONTEXTS: Symbol("LIST_RESEARCH_CONTEXTS"),
    KERNEL_CREATE_CONVERSATION: Symbol("KERNEL_CREATE_CONVERSATION"),
    KERNEL_FILE_UPLOAD: Symbol("KERNEL_FILE_UPLOADING"),
    KERNEL_FILE_DOWNLOAD: Symbol("KERNEL_FILE_DOWNLOAD"),
    KERNEL_LIST_CONVERSATIONS: Symbol("KERNEL_LIST_CONVERSATIONS"),
    KERNEL_LIST_MESSAGES_FOR_CONVERSATION: Symbol("KERNEL_LIST_MESSAGES_FOR_CONVERSATION"),
    KERNEL_LIST_SOURCE_DATA: Symbol("KERNEL_LIST_SOURCE_DATA"),
    KERNEL_LIST_RESEARCH_CONTEXTS: Symbol("KERNEL_LIST_RESEARCH_CONTEXTS"),
}