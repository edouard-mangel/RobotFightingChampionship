import { Express } from 'express'
import { Server } from 'http'
import { Logger } from '../../Log/port/logger'
import { serverListeningMessage } from './WebServerEventInteractor'

export class ExpressWebServerInstance {
    constructor (instance: Express, port: number, logger:Logger) {
        this.logger = logger
        this.port = port
        this.instance = instance
    }

    start ():Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server = this.instance.listen(this.port, () => {
                this.logger.info(serverListeningMessage(this.port))
                resolve()
            })
        })
    }

    close () {
        if (this.server)
            this.server.close(error => {
                if (error)
                    throw error
            })
    }

    readonly instance: Express;
    readonly port: number;
    private server: Server | undefined;
    private logger:Logger
}
