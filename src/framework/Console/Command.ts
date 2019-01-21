export interface Command {
    description: string
    command: string
    options?: string[]
    handle(...args: any[]): void
}
