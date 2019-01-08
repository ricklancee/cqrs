import { HttpKernel } from '../framework/Http/HttpKernel'
import { injectable } from 'inversify'

@injectable()
export class Kernel extends HttpKernel {
    public onError(error: Error) {
        console.log('Wow an error!')
    }

    public onExit() {
        console.log('Exiiting...')
    }
}
