export class AppError extends Error {
    public readonly extensions: { [key: string]: any } | undefined

    constructor(message: string, code: string) {
        super(message)

        this.extensions = { code }
    }
}
