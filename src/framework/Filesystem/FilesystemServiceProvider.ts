import { ServiceProvider } from '../Container/ServiceProvider'
import { FilesystemBinding, FilesystemOptionsBinding } from './FileSystem'
import {
    LocalFilesystem,
    LocalFilesystemOptionsBinding,
} from './LocalFilesystem'

export class FilesystemServiceProvider extends ServiceProvider {
    public register() {
        this.registerAdapters(
            {
                disk: [LocalFilesystem, LocalFilesystemOptionsBinding],
            },
            FilesystemBinding,
            FilesystemOptionsBinding,
            'filesystem'
        )
    }
}
