import { Readable } from 'stream'
import { LocalFilesystemOptions } from './LocalFilesystem'

export const FilesystemBinding = Symbol.for('FilesystemBinding')
export const FilesystemOptionsBinding = Symbol.for('FilesystemOptionsBinding')

export interface FilesystemOptions {
    adapter: keyof FilesystemOptions['adapters']
    adapters: {
        disk: LocalFilesystemOptions
    }
}

export interface Filesystem {
    read(filePath: string): Promise<Readable>
    write(
        filePath: string,
        readStream: string | Buffer | Readable
    ): Promise<void>
    exists(filePath: string): Promise<boolean>
    delete(filePath: string): Promise<boolean>
}
