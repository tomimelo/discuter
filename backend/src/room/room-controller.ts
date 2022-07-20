import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../lib/base-controller/base-controller'
import { SupabaseService } from '../supabase/supabase-service'
import { Logger } from '../types/logger'
import { User } from '../types/user'
import httpContext from 'express-http-context'
import { TwilioClient } from '../twilio/twilio-client'
import { CustomError } from '../utils/custom-error'

export class RoomController extends BaseController {
  public constructor (private readonly supabaseService: SupabaseService, private readonly twilioClient: TwilioClient, private readonly logger: Logger) {
    super()
  }

  public async getLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { uniqueName, id } = req.query

      if (!uniqueName || !id) throw new CustomError('Missing required parameters', 400)
      if (uniqueName && id) throw new CustomError('Only one of uniqueName or id can be specified', 400)

      const link = uniqueName
        ? await this.supabaseService.getRoomLinkByName(uniqueName as string)
        : await this.supabaseService.getRoomLinkByLinkId(id as string)

      if (link && link.created_by !== user.user_name) throw new CustomError('You do not have permission to access this room', 401)

      res.json({
        ok: true,
        link
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async createLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { uniqueName } = req.body

      if (!uniqueName) throw new CustomError('You need to specify a unique name', 400)

      const linkFound = await this.supabaseService.getRoomLinkByName(uniqueName)
      if (linkFound) throw new CustomError('Room link already exists', 400)

      const createdLink = await this.supabaseService.createRoomLink({
        room_name: uniqueName,
        created_by: user.user_name
      })

      res.json({
        ok: true,
        link: createdLink
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async deleteLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { uniqueName } = req.params

      if (!uniqueName) throw new CustomError('You need to specify a unique name', 400)

      const linkFound = await this.supabaseService.getRoomLinkByName(uniqueName)
      if (!linkFound) throw new CustomError('Room does not exist')
      if (linkFound && linkFound.created_by !== user.user_name) throw new CustomError('You do not have permission to delete this room link', 401)

      const deletedLink = await this.supabaseService.deleteRoomLink(uniqueName)

      res.json({
        ok: true,
        link: deletedLink
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async joinByLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { id } = req.params

      if (!id) throw new CustomError('You need to specify an id', 400)

      const linkFound = await this.supabaseService.getRoomLinkByLinkId(id)
      if (!linkFound) throw new CustomError('Room link does not exist', 404)

      await this.twilioClient.addUserToConversation(linkFound.room_name, user.user_name).catch((error) => {
        this.logger.error(error.message)
        if (error.status === 404) {
          throw new CustomError('Conversation does not exist', 404)
        }
        if (error.status === 409) {
          // User already in conversation
          return
        }
        throw new CustomError('Failed to add user to conversation')
      })

      res.json({
        ok: true,
        link: linkFound
      })
    } catch (error: any) {
      this.logger.error(error.message)
      next(error)
    }
  }

  public handleError (error: any, next: NextFunction): void {
    this.logger.error(error.message)
    next(error)
  }
}
