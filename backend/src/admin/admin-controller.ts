import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../lib/base-controller/base-controller'
import { SupabaseService } from '../supabase/supabase-service'
import { Logger } from '../types/logger'
import { TwilioClient } from '../twilio/twilio-client'

export class AdminController extends BaseController {
  public constructor (private readonly supabaseService: SupabaseService, private readonly twilioClient: TwilioClient, private readonly logger: Logger) {
    super()
  }

  public async wipeout (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.logger.info('Wiping out database')
      await Promise.all([
        this.supabaseService.deleteAllRooms(),
        this.twilioClient.removeAllConversations()
      ])
      this.logger.info('Database wiped out')

      res.json({
        ok: true,
        msg: 'All data has been wiped out'
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
