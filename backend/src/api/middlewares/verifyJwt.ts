import { NextFunction, Request, Response } from 'express'
import { AuthService } from '../../auth/auth-service'
import { getUser } from '../../utils/get-user'
import httpContext from 'express-http-context'
import { CustomError } from '../../utils/custom-error'

export const verifyJWT = (authService: AuthService) => {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.header('Authorization')
      const token = authHeader ? authHeader.split(' ')[1] : null

      if (!token) {
        throw new CustomError('Unauthorized access', 401)
      }

      const userMetadata = await authService.verifyJWT(token).catch(() => {
        throw new CustomError('Unauthorized access', 401)
      })

      httpContext.set('user', getUser(userMetadata))

      next()
    } catch (error: any) {
      next(error)
    }
  }
}

export default verifyJWT
