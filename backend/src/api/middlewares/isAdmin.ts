import { NextFunction, Request, Response } from 'express'
import httpContext from 'express-http-context'
import { User } from '../../types/user'
import { CustomError } from '../../utils/custom-error'

export const isAdmin = (): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  const adminUsername = process.env.ADMIN_USERNAME
  if (!adminUsername) {
    throw new Error('env variable ADMIN_USERNAME is not set')
  }
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')

      if (!user) {
        throw new CustomError('Unauthorized access', 401)
      }

      if (user.user_name !== adminUsername) {
        throw new CustomError('Unauthorized access', 401)
      }

      next()
    } catch (error: any) {
      next(error)
    }
  }
}

export default isAdmin
