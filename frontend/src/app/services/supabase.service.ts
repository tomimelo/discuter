import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SignEvent {
  event: 'SIGNED_IN' | 'SIGNED_OUT',
  session: Session | null
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient
  public onSignEvent = new Subject<SignEvent>()

  constructor() {
    this.supabase = this.getSupabaseClient();
    this.listenToAuthStateChange()
  }
  
  public async signIn() {
    return this.supabase.auth.signIn({
      provider: 'github',
    }, {
      redirectTo: `${environment.baseUrl}/auth`
    })
  }

  public listenToAuthStateChange() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        this.onSignEvent.next({
          event,
          session
        })
      }
    })
  }
  
  public async signOut() {
    return this.supabase.auth.signOut()
  }

  public getSession(): Session | null {
    return this.supabase.auth.session()
  }

  public getUser(): User | null {
    return this.supabase.auth.user()
  }

  private getSupabaseClient(): SupabaseClient {
    return createClient(environment.supabaseUrl, environment.supabaseKey)
  }
}
