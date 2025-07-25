import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = "";
  private username: string = "";

  constructor(private http: HttpClient, private router: Router) {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token') || "";
      this.username = localStorage.getItem('username') || "";
    }
  }

  API_URL: string = "https://drcp-backend-d40a.onrender.com/users";

  login(username: string, password: string): void {
    this.http.post(`${this.API_URL}/login`, { username, password }).subscribe({
      next: (response) => {
        this.token = JSON.stringify(response);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token);
          localStorage.setItem('username', username)
        }
        console.log("login req: " + this.token);
        this.username = username;
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err?.error?.error || 'Login failed');
      }

    });

  }

  register(username: string, email: string, password: string, role: string): void {
    this.http.post(`${this.API_URL}/register`, { username, email, password, role }).subscribe({
      next: (response) => {
        console.log("register req: " + JSON.stringify(response));
        this.router.navigate(['login']);
      },
      error: (err) => {
        alert(err?.error?.error || 'Signup failed');
      }
    });
  }

  logout(): void {
    this.token = "";
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    this.router.navigate(['login']);
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token') || "";
      this.username = localStorage.getItem('username') || "";
    }
    return !!this.token;
  }

  getToken(): string {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token') || "";
    }
    return this.token;
  }

  getUser(): string {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username') || "";
    }
    return this.username;
  }

  getLoggedUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.API_URL}/user`, { headers });
  }

  getExpirationTime(): Observable<any>{
    const token=localStorage.getItem('token');
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.API_URL}/user/expirationTime`, {headers});
  }
}