import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MovimientoInventario {
  id: number;
  productoNombre: string;
  cantidad: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  usuarioNombre: string;
  proveedor?: string;
  observaciones?: string;
}

export interface CompraRequest {
  items: { productoId: number; cantidad: number }[];
  proveedor?: string;
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/inventario/movimientos';

  listarMovimientos(inicio?: string, fin?: string): Observable<MovimientoInventario[]> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fin) params.fin = fin;
    return this.http.get<MovimientoInventario[]>(this.apiUrl, { params });
  }

  registrarCompra(compra: CompraRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/compras`, compra);
  }
}