import { AppError } from '../../framework/AppError'
import { GraphQLError } from 'graphql'

export class Handler {
    formatError(error: GraphQLError) {
        if (!error.originalError) {
            return error
        }

        // Mask any error that does not have an extension
        if (!error.extensions) {
            error.message = 'Something went wrong'
        }

        return error
    }

    report(error: Error | Error[]) {
        // foo
    }
}
