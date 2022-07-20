import { Injectable, OnDestroy } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { User } from '../types/user';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)
  private destroy$ = new Subject<void>()

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.onSignEvent.pipe(takeUntil(this.destroy$)).subscribe((signEvent) => {
      if (signEvent) {
        const {session} = signEvent
        const user = this.getUserFromSession(session)
        this.user$.next(user)
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public async signIn() {
    await this.supabaseService.signIn()
  }

  public async signOut() {
    await this.supabaseService.signOut()
  }

  public getUser() {
    return this.user$.asObservable()
  }

  private getUserFromSession(session: Session | null): User | null {
    if (!session) return null
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
