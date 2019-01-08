export interface LogMetaData {
    [key: string]: any
}

export interface Logger {
    debug(message: string, metaData?: LogMetaData): void
    info(message: string, metaData?: LogMetaData): void
    warn(message: string, metaData?: LogMetaData): void
    error(message: string, metaData?: LogMetaData): void
}

export const LoggerBinding = Symbol.for('LoggerBinding')
