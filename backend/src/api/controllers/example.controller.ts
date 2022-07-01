import { NextFunction, Request, Response } from 'express'
import { createCustomError } from '../../utils/helpers-functions'
import { loggerAcquirer } from '../../utils/logger-acquirer/logger-acquirer'

const logger = loggerAcquirer.acquire().child('ExampleController')

export default {
  example: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Example controller')
      res.json({ ok: true, msg: 'Ok!' })
    } catch (err) {
      next(createCustomError(err, 1000))
    }
  }
}
