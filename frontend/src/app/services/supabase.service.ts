import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = this.getSupabaseClient();
  }

  private getSupabaseClient(): SupabaseClient {
    return createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  public async signIn() {
    return this.supabase.auth.signIn({
      provider: 'github',
    }, {})
  }
}
