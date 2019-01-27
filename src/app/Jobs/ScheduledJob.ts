import { injectable } from 'inversify'
import { Job } from '../../framework/Queue/Job'

@injectable()
export class ScheduledJob extends Job {
    /** Every minute */
    public static schedule = '* * * * *'

    public handle() {
        console.log(`Running scheduled job at ${new Date().toLocaleString()}`)
    }
}
