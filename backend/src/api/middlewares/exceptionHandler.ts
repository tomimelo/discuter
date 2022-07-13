import { Request, Response, NextFunction } from 'express'
import { loggerAcquirer } from '../../utils/acquirers/logger-acquirer'

const logger = loggerAcquirer.acquire().child('ExceptionHandler')

export default {
  notFound: (req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${req.originalUrl} not found`)
    res.status(404).json({
      ok: false,
      error: {
        status: 404,
        message: `${req.originalUrl} not found`
      }
    })
  },
  internal: (error: any, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${error.message} - ${error.stack ? '\n' + error.stack : ''}`)
    res.status(error.status || 500)
    res.json({
      ok: false,
      error: {
        status: error.status || 500,
        message: error.message || 'Internal server error'
      }
    })
  }
}
