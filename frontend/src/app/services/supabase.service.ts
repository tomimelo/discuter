import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = this.getSupabaseClient();
  }
  
  public async signIn() {
    return this.supabase.auth.signIn({
      provider: 'github',
    }, {})
  }
  
  public async signOut() {
    return this.supabase.auth.signOut()
  }

  public getSession(): Session | null {
    return this.supabase.auth.session()
  }

  private getSupabaseClient(): SupabaseClient {
    return createClient(environment.supabaseUrl, environment.supabaseKey)
  }
}
