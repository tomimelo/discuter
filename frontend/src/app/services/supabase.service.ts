import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = this.getSupabaseClient();
  }

  private getSupabaseClient(): SupabaseClient {
    return createClient('https://qsewkuaclihjlpterjeq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZXdrdWFjbGloamxwdGVyamVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY3MTc0MzMsImV4cCI6MTk3MjI5MzQzM30.Y842Aa06USUjaq9oIDZ0JuQE453aOb96OdkIUgCgO8E')
  }

  public async signIn() {
    return this.supabase.auth.signIn({
      provider: 'github',
    })
  }
}
