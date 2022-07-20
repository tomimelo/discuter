import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { RoomLink } from '../room/room'
import { CustomError } from '../utils/custom-error'
import { SupabaseConfig } from './supabase-config'
import { v4 as uuidv4 } from 'uuid'

export class SupabaseService {
  private client: SupabaseClient
  public constructor (private readonly config: SupabaseConfig) {
    this.client = createClient(this.config.url, this.config.serviceRole)
  }

  public async getRoomLinks (): Promise<ReadonlyArray<RoomLink>> {
    const { data: rooms } = await this.client.from<RoomLink>('room_links').select('*')
    return rooms || []
  }

  public async getRoomLinkByLinkId (id: string): Promise<RoomLink | null> {
    const result = await this.client.from<RoomLink>('room_links').select('*').eq('link_id', id)
    if (result.error) {
      if (result.error.code === '22P02') return null
      throw new CustomError('Error getting room link')
    }
    return result.data.length ? result.data[0] : null
  }

  public async getRoomLinkByName (roomName: string): Promise<RoomLink | null> {
    const result = await this.client.from<RoomLink>('room_links').select('*').eq('room_name', roomName)
    if (result.error) throw new CustomError('Error getting room link')
    return result.data.length ? result.data[0] : null
  }

  public async createRoomLink (room: Pick<RoomLink, 'room_name' | 'created_by'>): Promise<RoomLink> {
    const result = await this.client.from<RoomLink>('room_links').insert(room)
    if (result.error) throw new CustomError('Error creating room link')
    return result.data[0]
  }

  public async updateRoomLink (roomName: string): Promise<RoomLink> {
    const newUuid = uuidv4()
    const result = await this.client.from<RoomLink>('room_links').update({ link_id: newUuid }).eq('room_name', roomName)
    if (result.error) throw new CustomError('Error updating room link')
    return result.data[0]
  }

  public async deleteRoomLink (roomName: string): Promise<RoomLink> {
    const result = await this.client.from<RoomLink>('room_links').delete().eq('room_name', roomName)
    if (result.error) throw new CustomError('Error deleting room link')
    return result.data[0]
  }

  public async deleteAllRoomLinks (): Promise<void> {
    const roomLinks = await this.getRoomLinks()
    await Promise.all(roomLinks.map(roomLink => this.deleteRoomLink(roomLink.room_name)))
  }
}
