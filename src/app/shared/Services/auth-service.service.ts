import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/login/';
  private registerUrl = 'http://127.0.0.1:8000/register/';
  private accessToken = 'accessToken';
  loggedIn: boolean;
  username: string;
  authStatus = new EventEmitter<boolean>();
  userId?: number; 


  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn = this.checkToken();
    this.username = this.getUsernameFromToken();
    this.getUserIdFromServer();
  }
  
  register(user: User) {
    const body = { ...user };
    return this.http.post(this.registerUrl, body).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem(this.accessToken, token);
        this.loggedIn = true;
        this.username = this.getUsernameFromToken();
        this.getUserIdFromServer();
      })
    );
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  login(user: User) {
    const body = { username: user.username, password: user.password };
    return this.http.post(this.apiUrl, body).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem(this.accessToken, token);
        this.loggedIn = true;
        this.username = this.getUsernameFromToken();
        this.getUserIdFromServer();
      })
    );
  }

  logout() {
    localStorage.removeItem(this.accessToken);
    this.loggedIn = false;
    this.username = '';
    this.userId = 0; // Reset the user ID
  }

  private checkToken(): boolean {
    const token = localStorage.getItem(this.accessToken);
    return !!token;
  }

  private getUsernameFromToken(): string {
    const token = localStorage.getItem(this.accessToken);
    // Implement logic to extract and decode the username from the token
    // Return the extracted username
    return ''; // Placeholder return statement
  }

  private getUserIdFromServer() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem(this.accessToken)}`
    };

    this.http.get('http://localhost:8000/user-id/', { headers }).subscribe(
      (response: any) => {
        this.userId = response.user_id;
        this.authStatus.emit(true); // Emit the authentication status
        // console.log('User ID auth get:', this.userId); // Log the user ID
      },
      (error) => {
        console.error('Failed to retrieve user ID:', error);
        this.userId = undefined; // Set userId to undefined
        this.authStatus.emit(false); // Emit the authentication status
      }
    );
  }
}
