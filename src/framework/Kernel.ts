export const KernelBinding = Symbol.for('KernelBinding')

export type BootCallback = () => void

export interface Kernel {
    boot(callback: BootCallback): void | Promise<void>
}
