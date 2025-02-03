import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const data = { email, password };

    return this.http.post<any>(``, data).pipe(
      // Save the token to localStorage when login is successful

    );
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // Remove the token from localStorage
  }
  getUsername(): string | null {
    const token = localStorage.getItem('currentUser');
    if (!token) {
      console.log("le token not found");
      return null;
    }

    try {
      return localStorage.getItem('username')|| null; // Retourne le champ "username" ou null
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  getRole(): string | null {
    const token = localStorage.getItem('currentUser');
    if (!token) {
      return null;
    }
    try {
      return localStorage.getItem('role')|| null; // Retourne le champ "username" ou null

    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }

  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser'); // Check if token exists in localStorage
  }

  getToken(): string | null {
    return localStorage.getItem('currentUser'); // Retrieve the token from localStorage
  }
}
