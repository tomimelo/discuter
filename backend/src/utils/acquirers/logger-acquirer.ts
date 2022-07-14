import { MadLogger, MadLoggerManager } from 'mad-logger'
import path from 'path'
import { Acquirer } from './acquirer'

class LoggerAcquirer implements Acquirer<MadLogger> {
  private logger: MadLogger
  public constructor (config: any) {
    const loggerManager = new MadLoggerManager()
    const consoleTransport = loggerManager.getConsoleTransport()
    const transports: any[] = [consoleTransport]
    if (process.env.NODE_ENV === 'development') {
      const fileTransport = loggerManager.getFileTransport(config)
      transports.push(fileTransport)
    }
    loggerManager.addTransport(transports)
    this.logger = loggerManager.createLogger('Root')
  }

  public acquire (): MadLogger {
    return this.logger
  }
}

const defaultLoggerConfig = {
  filename: path.join(__dirname, '../../../logs/discuter-%DATE%.log')
}

export const loggerAcquirer = new LoggerAcquirer(defaultLoggerConfig)
