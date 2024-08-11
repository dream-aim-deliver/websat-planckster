export const SIGNAL_FACTORY = {
    KERNEL_FILE_UPLOAD: Symbol("KERNEL_FILE_UPLOADING"),
    KERNEL_FILE_DOWNLOAD: Symbol("KERNEL_FILE_DOWNLOAD"),
}

export const TRPC = {
    REACT_CLIENT_COMPONENTS_API: Symbol("TRPC_REACT_CLIENT_API"),
    VANILLA_CLIENT: Symbol("TRPC_VANILLA_CLIENT"),
}

export const UTILS = {
    LOGGER_FACTORY: Symbol("LOGGER_FACTORY"),
}
export const REPOSITORY = {
    FILE_REPOSITORY: Symbol("FILE_REPOSITORY"),
    BROWSER_SOURCE_DATA_REPOSITORY: Symbol("BROWSER_SOURCE_DATA_REPOSITORY"),
    KERNEL_FILE_REPOSITORY: Symbol("KERNEL_FILE_REPOSITORY"),
    BROWSER_RESEARCH_CONTEXT_REPOSITORY: Symbol("BROWSER_RESEARCH_CONTEXT_REPOSITORY"),
}

export const CONTROLLERS = {
    KERNEL_FILE_UPLOAD_CONTROLLER: Symbol("KERNEL_FILE_UPLOAD_CONTROLLER"),
    KERNEL_FILE_DOWNLOAD_CONTROLLER: Symbol("KERNEL_FILE_DOWNLOAD_CONTROLLER"),
    CREATE_CONVERSATION_CONTROLLER: Symbol("CREATE_CONVERSATION_CONTROLLER"),
    CREATE_RESEARCH_CONTEXT_CONTROLLER: Symbol("CREATE_RESEARCH_CONTEXT_CONTROLLER"),
    LIST_CONVERSATIONS_CONTROLLER: Symbol("LIST_CONVERSATIONS_CONTROLLER"),
    LIST_MESSAGES_FOR_CONVERSATION_CONTROLLER: Symbol("LIST_MESSAGES_FOR_CONVERSATION_CONTROLLER"),
    LIST_RESEARCH_CONTEXTS_CONTROLLER: Symbol("LIST_RESEARCH_CONTEXTS_CONTROLLER"),
    LIST_SOURCE_DATA_CONTROLLER: Symbol("LIST_SOURCE_DATA_CONTROLLER"),
    SEND_MESSAGE_TO_CONVERSATION_CONTROLLER: Symbol("SEND_MESSAGE_TO_CONVERSATION_CONTROLLER"),
}

export const GATEWAYS = {
    AGENT_GATEWAY: Symbol("AGENT_GATEWAY"),
    CONVERSATION_GATEWAY: Symbol("CONVERSATION_GATEWAY"),
}