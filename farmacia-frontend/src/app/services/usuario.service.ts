import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  username: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol: string;
}

export interface UsuarioRequest {
  username: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/admin/usuarios';

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}