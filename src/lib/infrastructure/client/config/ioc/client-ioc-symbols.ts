export const TRPC = {
    REACT_CLIENT_COMPONENTS_API: Symbol("TRPC_REACT_CLIENT_API"),
    VANILLA_CLIENT: Symbol("TRPC_VANILLA_CLIENT"),
}

export const UTILS = {
    LOGGER_FACTORY: Symbol("LOGGER_FACTORY"),
}

export const USECASE_FACTORY ={
    CREATE_RESEARCH_CONTEXT: Symbol("CREATE_RESEARCH_CONTEXT"),
    FILE_UPLOAD: Symbol("FILE_UPLOAD"),
    FILE_DOWNLOAD: Symbol("FILE_DOWNLOAD"),
    LIST_RESEARCH_CONTEXTS: Symbol("LIST_RESEARCH_CONTEXTS"),
    SEND_MESSAGE_TO_CONVERSATION: Symbol("SEND_MESSAGE_TO_CONVERSATION"),
}

export const REPOSITORY = {
}

export const GATEWAYS = {
    AGENT_GATEWAY: Symbol("AGENT_GATEWAY"),
    CONVERSATION_GATEWAY: Symbol("CONVERSATION_GATEWAY"),
    RESEARCH_CONTEXT_GATEWAY: Symbol("BROWSER_RESEARCH_CONTEXT_GATEWAY"),
    VECTOR_STORE_GATEWAY: Symbol("VECTOR_STORE_GATEWAY"),
    KERNEL_SOURCE_DATA_GATEWAY: Symbol("KERNEL_SOURCE_DATA_GATEWAY"),
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
