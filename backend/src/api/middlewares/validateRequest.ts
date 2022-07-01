import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createCustomError } from '../../utils/helpers-functions'

export default function (req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = { status: 400, message: 'Bad request', data: errors.array(), code: 40 }
    throw createCustomError(error, 40)
  }

  next()
}
