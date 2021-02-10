class Server {
    static VERSION = '1.0.1';

    private status: string = 'working';

    constructor(public name: string, protected ip: number) {
    }

    private turnOn() {
        this.status = 'working';
    }

    protected turnOff() {
        this.status = 'offline';
    }

    public getStatus(): string {
        return this.status;
    }
}

const server: Server = new Server('AWS', 1234);