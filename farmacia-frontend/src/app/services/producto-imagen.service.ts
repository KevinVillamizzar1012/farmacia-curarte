import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductoImagen {
  id: number;
  url: string;
  orden: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoImagenService {
  private apiUrl = 'http://localhost:8080/api/productos';
  private backendBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // ✅ Este es el método que faltaba
  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `${this.backendBaseUrl}${imageUrl}`;
  }

  subirImagenes(productoId: number, files: File[]): Observable<ProductoImagen[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<ProductoImagen[]>(`${this.apiUrl}/${productoId}/imagenes`, formData);
  }

  eliminarImagen(imagenId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/imagenes/${imagenId}`);
  }

  obtenerImagenes(productoId: number): Observable<ProductoImagen[]> {
    return this.http.get<ProductoImagen[]>(`${this.apiUrl}/${productoId}/imagenes`);
  }
}