export interface Command {
    description: string
    keepAlive?: boolean
    command: string
    options?: string[]
    handle(...args: any[]): void
}
