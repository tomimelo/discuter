import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Room } from '../room/room'
import { CustomError } from '../utils/custom-error'
import { SupabaseConfig } from './supabase-config'

export class SupabaseService {
  private client: SupabaseClient
  public constructor (private readonly config: SupabaseConfig) {
    this.client = createClient(this.config.url, this.config.serviceRole)
  }

  public async getRooms (): Promise<ReadonlyArray<Room>> {
    const { data: rooms } = await this.client.from<Room>('rooms').select('*')
    return rooms || []
  }

  public async getRoomById (id: string): Promise<Room | null> {
    const result = await this.client.from<Room>('rooms').select('*').eq('id', id)
    if (result.error) {
      if (result.error.code === '22P02') return null
      throw new CustomError('Error getting room')
    }
    return result.data.length ? result.data[0] : null
  }

  public async getRoomByUniqueName (uniqueName: string): Promise<Room | null> {
    const result = await this.client.from<Room>('rooms').select('*').eq('unique_name', uniqueName)
    if (result.error) throw new CustomError('Error getting room')
    return result.data.length ? result.data[0] : null
  }

  public async createRoom (room: Pick<Room, 'unique_name' | 'user'>): Promise<Room> {
    const result = await this.client.from<Room>('rooms').insert(room)
    if (result.error) throw new CustomError('Error creating room')
    return result.data[0]
  }

  public async deleteRoom (uniqueName: string): Promise<Room> {
    const result = await this.client.from<Room>('rooms').delete().eq('unique_name', uniqueName)
    if (result.error) throw new CustomError('Error deleting room')
    return result.data[0]
  }
}
