import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  usuarioId: number;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  obtenerVentasPorFecha(inicio: string, fin: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas/reportes/ventas?inicio=${inicio}&fin=${fin}`);
  }

  obtenerVentasHoy(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/ventas/reportes/ventas-hoy`);
  }

  obtenerProductosMasVendidos(inicio?: string, fin?: string): Observable<any[]> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fin) params.fin = fin;
    return this.http.get<any[]>(`${this.apiUrl}/ventas/reportes/productos-mas-vendidos`, { params });
  }

  obtenerStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/admin/stock-bajo`);
  }

  obtenerProximosVencer(dias: number = 30): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/admin/proximos-vencer?dias=${dias}`);
  }

  // Métodos para el panel de administración
  obtenerUltimasVentas(limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/reportes/ultimas-ventas?limit=${limit}`);
  }

  obtenerVentasPorDia(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ventas/reportes/ventas-por-dia`);
  }
}