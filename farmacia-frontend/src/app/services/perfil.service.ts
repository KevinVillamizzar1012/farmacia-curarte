import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerfilDTO {
  id: number;
  nombre: string;        // ← nombre completo (no username)
  email: string;
  rol: string;           // ← rol del usuario
  telefono?: string;
  codigoArea?: string;
  fechaNacimiento?: string;
  avatarBase64?: string;
}

export interface PerfilActualizarRequest {
  nombre?: string;
  telefono?: string;
  codigoArea?: string;
  fechaNacimiento?: string;
  password?: string;     // ← opcional para cambiar contraseña
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<PerfilDTO> {
    return this.http.get<PerfilDTO>(`${this.apiUrl}/perfil`);
  }

  actualizarPerfil(data: PerfilActualizarRequest): Observable<PerfilDTO> {
    return this.http.put<PerfilDTO>(`${this.apiUrl}/perfil`, data);
  }

  subirAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post(`${this.apiUrl}/perfil/avatar`, formData);
  }

  obtenerAvatarUrl(userId: number): Observable<string> {
    return new Observable(observer => {
      observer.next(`${this.apiUrl}/${userId}/avatar`);
      observer.complete();
    });
  }
}