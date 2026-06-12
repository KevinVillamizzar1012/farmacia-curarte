import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  rol: string;
  id: number;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('username', res.username);
          localStorage.setItem('usuarioId', res.id.toString());
        }
      })
    );
  }

  // Método register actualizado para aceptar todos los campos del registro
  register(user: {
    username: string;
    password: string;
    email?: string;
    rol?: string;
    nombre?: string;
    apellido?: string;
    fechaNacimiento?: string;
    codigoArea?: string;
    telefono?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, user);
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}