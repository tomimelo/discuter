import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  constructor(private http: HttpClient) { }

  getAccessToken() {
    return this.http.get(`${environment.apiUrl}/twilio/access-token`,  { headers: this.getAuthorizationHeader() });
  }

  getAuthorizationHeader() {
    return {
      'Authorization': `Bearer ${this.getToken()}`
    }
  }

  getToken(): string | null {
    const localStorageData = localStorage.getItem('supabase.auth.token');
    if (!localStorageData) return null
    const parsedData = JSON.parse(localStorageData);
    if (typeof parsedData !== 'object') return null
    return parsedData.currentSession?.access_token || null
  }
}
