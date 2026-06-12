import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Banner {
  id: number;
  url: string;
  orden: number;
  activo: boolean;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/banners';

  // Obtener banners activos (público)
  getBannersActivos(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/activos`);
  }

  // Obtener todos los banners (solo admin)
  listarTodos(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}`);
  }

  // Subir nuevo banner (admin)
  subirBanner(file: File, orden: number): Observable<Banner> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orden', orden.toString());
    return this.http.post<Banner>(`${this.apiUrl}`, formData);
  }

  // Actualizar orden (admin)
  actualizarOrden(id: number, orden: number): Observable<Banner> {
    return this.http.put<Banner>(`${this.apiUrl}/${id}/orden?orden=${orden}`, {});
  }

  // Actualizar estado (activo/inactivo)
  actualizarEstado(id: number, activo: boolean): Observable<Banner> {
    return this.http.put<Banner>(`${this.apiUrl}/${id}/estado?activo=${activo}`, {});
  }

  // Eliminar banner (admin)
  eliminarBanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener URL completa de la imagen (para el frontend)
  getFullImageUrl(url: string): string {
    if (!url) return '';
    return `http://localhost:8080${url}`;
  }
}