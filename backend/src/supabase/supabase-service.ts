import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Room } from '../types/room'
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

  public async getRoomByUniqueName (uniqueName: string): Promise<any> {
    const { data } = await this.client.from<Room>('rooms').select('*').eq('unique_name', uniqueName)
    return data && data.length ? data[0] : null
  }

  public async createRoom (room: Pick<Room, 'unique_name' | 'user'>): Promise<any> {
    const { data } = await this.client.from<Room>('rooms').insert(room)
    return data && data.length ? data[0] : null
  }
}
