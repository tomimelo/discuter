import { Injectable } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { User } from '../types/user';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  constructor(private supabaseService: SupabaseService) {
    this.checkUser()
  }

  public async signIn() {
    await this.supabaseService.signIn()
  }

  public async signOut() {
    await this.supabaseService.signOut()
    this.user.next(null)
  }

  public getUser() {
    return this.user.asObservable()
  }

  private checkUser() {
    const session = this.supabaseService.getSession()
    if (!session) return
    const user = this.getUserFromSession(session)
    if (!user) return
    this.user.next(user)
  }

  private getUserFromSession(session: Session): User | null {
    const user_metadata = session.user?.user_metadata
    if (!user_metadata) return null
    return {
      avatar_url: user_metadata['avatar_url'],
      email: user_metadata['email'],
      full_name: user_metadata['full_name'],
      name: user_metadata['name'],
      user_name: user_metadata['user_name']
    }
  }

}
