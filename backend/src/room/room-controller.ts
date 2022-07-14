import { NextFunction, Request, Response } from 'express'
import { BaseController } from '../lib/base-controller/base-controller'
import { SupabaseService } from '../supabase/supabase-service'
import { Logger } from '../types/logger'
import { User } from '../types/user'
import httpContext from 'express-http-context'
import { TwilioClient } from '../twilio/twilio-client'

export class RoomController extends BaseController {
  public constructor (private readonly supabaseService: SupabaseService, private readonly twilioClient: TwilioClient, private readonly logger: Logger) {
    super()
  }

  public async getLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { uniqueName, id } = req.query

      if (!uniqueName || !id) throw new Error('Missing required parameters')
      if (uniqueName && id) throw new Error('Only one of uniqueName or id can be specified')

      const room = uniqueName
        ? await this.supabaseService.getRoomByUniqueName(uniqueName as string)
        : await this.supabaseService.getRoomById(id as string)

      if (room && room.user !== user.user_name) throw new Error('You do not have permission to access this room')

      res.json({
        ok: true,
        room
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async createLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { uniqueName } = req.body

      if (!uniqueName) throw new Error('You need to specify a unique name')

      const roomFound = await this.supabaseService.getRoomByUniqueName(uniqueName)
      if (roomFound) throw new Error('Room already exists')

      const createdRoom = await this.supabaseService.createRoom({
        unique_name: uniqueName,
        user: user.user_name
      })

      res.json({
        ok: true,
        room: createdRoom
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async deleteLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { uniqueName } = req.params

      if (!uniqueName) throw new Error('You need to specify a unique name')

      const roomFound = await this.supabaseService.getRoomByUniqueName(uniqueName)
      if (!roomFound) throw new Error('Room does not exist')
      if (roomFound && roomFound.user !== user.user_name) throw new Error('You do not have permission to delete this room')

      const deletedRoom = await this.supabaseService.deleteRoom(uniqueName)

      res.json({
        ok: true,
        room: deletedRoom
      })
    } catch (error) {
      this.handleError(error, next)
    }
  }

  public async joinByLink (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: User = httpContext.get('user')
      const { id } = req.params

      if (!id) throw new Error('You need to specify an id')

      const roomFound = await this.supabaseService.getRoomById(id)
      if (!roomFound) throw new Error('Room does not exist')

      await this.twilioClient.addUserToConversation(roomFound.unique_name, user.user_name).catch((error) => {
        this.logger.error(error.message)
        if (error.status === 404) {
          throw new Error('Conversation does not exist')
        }
        if (error.status === 409) {
          throw new Error('User already in conversation')
        }
        throw new Error('Failed to add user to conversation')
      })

      res.json({
        ok: true,
        room: roomFound
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
