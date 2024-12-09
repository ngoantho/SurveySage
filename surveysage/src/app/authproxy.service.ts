import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthproxyService {
  userEmail?: string;
  userId?: number;
  displayName?: string;
  loggedIn?: boolean;

  constructor(private httpClient: HttpClient) {
    // note: service isn't created on page load
  }

  getUserId() {
    return this.httpClient.get<string>('/auth/id').toPromise()
  }

  getUserEmail() {
    return this.httpClient.get<string>('/auth/email').toPromise()
  }

  getDisplayName() {
    return this.httpClient.get<string>('/auth/displayName').toPromise()
  }

  getAuthStatus() {
    return this.httpClient.get<boolean>('/auth/status')
  }
}
