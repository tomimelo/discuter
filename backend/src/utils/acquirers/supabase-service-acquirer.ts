import { SupabaseConfig } from '../../supabase/supabase-config'
import { SupabaseService } from '../../supabase/supabase-service'
import { Acquirer } from './acquirer'

class SupabaseServiceAcquirer implements Acquirer<SupabaseService> {
  private supabaseService: SupabaseService
  public constructor (config: SupabaseConfig) {
    this.supabaseService = new SupabaseService(config)
  }

  public acquire (): SupabaseService {
    return this.supabaseService
  }
}

const supabaseConfig: SupabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE || ''
}

export const supabaseServiceAcquirer = new SupabaseServiceAcquirer(supabaseConfig)
