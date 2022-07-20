import httpContext from 'express-http-context'
import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../lib/base-controller/base-controller'
import { Logger } from '../types/logger'
import { User } from '../types/user'
import { TwilioClient } from './twilio-client'

export class TwilioController extends BaseController {
  public constructor (private readonly client: TwilioClient, private readonly logger: Logger) {
    super()
  }

  public async getAccessToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const accessToken = this.client.getAccessTokenWithGrant(user.user_name)
      res.json({
        ok: true,
        accessToken
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public handleError (error: any, next: NextFunction): void {
    this.logger.error(error.message)
    next(error)
  }
}
