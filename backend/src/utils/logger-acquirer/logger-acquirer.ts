import { MadLogger, MadLoggerManager } from 'mad-logger'
import path from 'path'

class LoggerAcquirer {
  private logger: MadLogger
  public constructor (config: any) {
    const loggerManager = new MadLoggerManager()
    const consoleTransport = loggerManager.getConsoleTransport()
    const fileTransport = loggerManager.getFileTransport(config)
    loggerManager.addTransport([consoleTransport, fileTransport])
    this.logger = loggerManager.createLogger('Root')
  }

  public acquire (): MadLogger {
    return this.logger
  }
}

const defaultLoggerConfig = {
  filename: path.join(__dirname, '../../../logs/myapp-%DATE%.log')
}

export const loggerAcquirer = new LoggerAcquirer(defaultLoggerConfig)
