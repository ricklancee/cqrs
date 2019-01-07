import { HttpKernel } from '../framework/Http/HttpKernel'
import { injectable } from 'inversify'

@injectable()
export class GraphQLKernel extends HttpKernel {
    protected httpMiddleware = []

    protected dataloaders = {}

    public context(request: Request) {
        return {}
    }
}
