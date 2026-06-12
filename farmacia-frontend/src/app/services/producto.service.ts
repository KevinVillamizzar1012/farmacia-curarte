import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  consultarProductos(filtros?: { nombre?: string; categoria?: string; disponible?: boolean }): Observable<Producto[]> {
    let params = new HttpParams();
    if (filtros?.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.disponible !== undefined) params = params.set('disponible', filtros.disponible);
    return this.http.get<Producto[]>(`${this.apiUrl}/consultar`, { params });
  }

  buscarPorCodigoBarras(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/codigo/${codigo}`);
  }

  getStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/admin/stock-bajo`);
  }

  getProximosVencer(dias: number = 30): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/admin/proximos-vencer?dias=${dias}`);
  }

  // CRUD para administradores
  crearProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/admin/crear`, producto);
  }

  actualizarProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/admin/actualizar/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/eliminar/${id}`);
  }
}