import { Filesystem } from './FileSystem'
import { Readable } from 'stream'
import * as fs from 'fs'
import * as path from 'path'
import { inject, injectable } from 'inversify'

export interface LocalFilesystemOptions {
    basePath: string
}

export const LocalFilesystemOptionsBinding = Symbol.for(
    'LocalFilesystemOptionsBinding'
)

@injectable()
export class LocalFilesystem implements Filesystem {
    constructor(
        @inject(LocalFilesystemOptionsBinding)
        private options: LocalFilesystemOptions
    ) {}

    public read(filePath: string): Promise<Readable> {
        return Promise.resolve(fs.createReadStream(this.getLocalPath(filePath)))
    }

    public write(
        filePath: string,
        readable: string | Buffer | Readable
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.ensureDirectoryExists(filePath)

            const writeStream = fs.createWriteStream(
                this.getLocalPath(filePath)
            )

            writeStream.on('error', error => reject(error))
            writeStream.on('close', () => resolve())

            if (typeof readable === 'string' || readable instanceof Buffer) {
                writeStream.write(readable)
                writeStream.end()
                return
            }

            readable.pipe(writeStream)
        })
    }

    public exists(filePath: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.exists(this.getLocalPath(filePath), exists => resolve(exists))
        })
    }

    public delete(filePath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.unlink(this.getLocalPath(filePath), err => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(true)
            })
        })
    }

    private async ensureDirectoryExists(filePath: string): Promise<boolean> {
        if (await this.exists(filePath)) {
            return true
        }

        return new Promise((resolve, reject) => {
            const localPath = this.getLocalPath(filePath)

            fs.mkdir(
                path.dirname(localPath),
                {
                    recursive: true,
                },
                error => {
                    if (error) {
                        reject(error)
                        return
                    }
                    resolve(true)
                }
            )
        })
    }

    private getLocalPath(filePath: string) {
        if (path.isAbsolute(filePath)) {
            return filePath
        }

        return path.join(this.options.basePath, filePath)
    }
}
