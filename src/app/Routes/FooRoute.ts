import { Route } from '../../framework/Http/Route'
import { Request, Response } from 'express'
import { injectable } from 'inversify'

@injectable()
export class FooRoute implements Route {
    public pathname: string = '/foo'

    public get(req: Request, res: Response) {
        res.send('wooo')
    }
}
