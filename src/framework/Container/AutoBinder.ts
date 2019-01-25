import * as path from 'path'
import * as globber from 'glob'

import { Container } from 'inversify'

/**
 * Extension of a file
 *
 * **Note**: it should not contain a prefixed '.' -> `ts` instead of `.ts` or `js` instead of `.js`
 */
type FileExtension = string

export class AutoBinder {
    /**
     * The default extensions to use when a user does not provide extensions in their glob patterns
     *
     * **Note**: `ts` and `js` is provided as a sensible default, as most code is either
     * written in Javascript or it's written in Typescript and compiled to Javascript
     */
    private defaultExtensions: FileExtension[] = ['ts', 'js']

    /**
     * The regexp patterns that should be ignored when autobinding a file to the container
     */
    private ignorePatterns: RegExp[] = []

    /**
     * @param container
     * The ioc container which this autobinder will bind on
     *
     * @param basePath
     * The **absolute** path to the base directory from which this autobinder should start resolving
     */
    constructor(private container: Container) {}

    /**
     * Provide a list of glob file locations to bind to the container
     *
     * @param globs
     */
    public autobind(basePath: string, globs: string[]) {
        for (const glob of globs) {
            const files = this.getFilesForGlob(basePath, glob)

            for (const file of files) {
                this.autobindFile(file)
            }
        }
    }

    /**
     * Provide a list of regexes to ignore when finding files to bind to the container
     * For example; when tests are close to the source code, you can ignore those files
     *
     * @param patterns
     */
    public ignore(...patterns: RegExp[]) {
        this.ignorePatterns.push(...patterns)

        return this
    }

    /**
     * Provide a list of extensions that should be used when no extension
     * is provided in the glob patterns provided in `autobind()`
     *
     * @param extensions
     */
    public extensions(...extensions: FileExtension[]) {
        this.defaultExtensions = extensions

        return this
    }

    /**
     * Find all absolute file paths that match the given glob
     *
     * @param glob
     */
    private getFilesForGlob(basePath: string, glob: string) {
        const extension = path.extname(glob)
            ? ''
            : `.{${this.defaultExtensions.join(',')}}`
        const location = path.join(basePath, glob + extension)
        return globber.sync(location)
    }

    /**
     * Autobind a given absolute file path to the container
     *
     * @param file
     */
    private autobindFile(file: string) {
        for (const pattern of this.ignorePatterns) {
            if (pattern.test(file)) {
                return
            }
        }

        const basename = path.basename(file)
        const extension = path.extname(file)

        const className = basename.replace(extension, '')

        const exports = require(file)

        if (className in exports) {
            this.container.bind(exports[className]).toSelf()
        }
    }
}
