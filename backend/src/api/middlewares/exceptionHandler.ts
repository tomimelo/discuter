import { Request, Response, NextFunction } from 'express'
import { loggerAcquirer } from '../../utils/logger-acquirer/logger-acquirer'

import { validToShowErrorMessage } from '../../utils/vaild-error-codes'

const logger = loggerAcquirer.acquire().child('ExceptionHandler')

export default {
  notFound: (req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${req.baseUrl} not found`)
    res.status(404).json({
      ok: false,
      error: {
        status: 404,
        message: `${req.baseUrl} not found`
      }
    })
  },
  internal: (error: any, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${error.message} - code: ${error.code} ${error.stack ? '\n' + error.stack : ''}`)
    res.status(error.status || 500)
    res.json({
      ok: false,
      error: {
        status: error.status || 500,
        message: validToShowErrorMessage(error.code) ? error.message || 'Internal server error' : 'Internal server error',
        code: error.code || -1,
        data: error.data
      }
    })
  }
}
