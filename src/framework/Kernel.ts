export abstract class Kernel {
    public boot: () => void | Promise<void>
}
