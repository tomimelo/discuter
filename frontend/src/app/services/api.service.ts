import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoomLink } from '../types/room';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private twilioRoutesPath = `${environment.apiUrl}/twilio`
  private roomLinksRoutesPath = `${environment.apiUrl}/rooms`

  constructor(private http: HttpClient, private supabaseService: SupabaseService) { }

  public getAccessToken(): Observable<string> {
    const jwt = this.getJWT()
    return this.http.get(`${this.twilioRoutesPath}/access-token`,  { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.accessToken)
      );
  }

  public getRoomLinkByUniqueName(uniqueName: string): Observable<RoomLink> {
    const params = new HttpParams().append('uniqueName', uniqueName)
    const jwt = this.getJWT()
    return this.http.get(`${this.roomLinksRoutesPath}/link`,  { params, headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.link)
      );
  }

  public getRoomLinkById(id: string): Observable<RoomLink> {
    const params = new HttpParams().append('id', id)
    const jwt = this.getJWT()
    return this.http.get(`${this.roomLinksRoutesPath}/link`,  { params, headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.link)
      );
  }

  public getRoomLink(queryParams: {uniqueName: string, id: string}): Observable<string> {
    const params = new HttpParams().appendAll(queryParams)
    const jwt = this.getJWT()
    return this.http.get(`${this.roomLinksRoutesPath}/`,  { params, headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.accessToken)
      );
  }

  public createRoomLink(uniqueName: string): Observable<RoomLink> {
    const jwt = this.getJWT()
    return this.http.post(`${this.roomLinksRoutesPath}/link`,  { uniqueName }, { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.link)
      );
  }

  public updateRoomLink(uniqueName: string): Observable<RoomLink> {
    const jwt = this.getJWT()
    return this.http.put(`${this.roomLinksRoutesPath}/link/${uniqueName}`, {}, { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.link)
      );
  }

  public deleteRoomLink(uniqueName: string): Observable<RoomLink> {
    const jwt = this.getJWT()
    return this.http.delete(`${this.roomLinksRoutesPath}/link/${uniqueName}`, { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.link)
      );
  }

  public joinRoomById(id: string): Observable<RoomLink> {
    const jwt = this.getJWT()
    return this.http.get(`${this.roomLinksRoutesPath}/join/${id}`, { headers: this.getAuthorizationHeader(jwt) })
      .pipe(
        map((res: any) => res.link)
      );
  }

  private getAuthorizationHeader(jwt: string): { 'Authorization': string } {
    return {
      'Authorization': `Bearer ${jwt}`
    }
  }

  private getJWT(): string {
    const session = this.supabaseService.getSession()
    if (!session) throw new Error('You are not signed in')
    return session.access_token
  }
}
