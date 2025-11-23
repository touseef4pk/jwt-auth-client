import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5003/api/authorize';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credentials);
  }

  refreshToken(): Observable<TokenResponse | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    const token = localStorage.getItem('access_token');

    if (!refreshToken || !token) {
      return of(null); // keep return type Observable
    }

    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, {
      token: token,
      refreshtoken: refreshToken
    });
  }
  

  storeTokens(tokens: TokenResponse) {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  
  getProducts(): Observable<any[]> {
     return this.http.get<any[]>(this.apiUrl.replace('authorize', 'product') + '/GetProducts');
  }

}
