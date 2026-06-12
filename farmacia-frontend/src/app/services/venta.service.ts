import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemVenta {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  usuarioId: number;
  items: ItemVenta[];   // ← cambiado: debe coincidir con la estructura del backend
}

@Injectable({ providedIn: 'root' })
export class VentaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ventas';

  registrarVenta(venta: VentaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, venta);
  }
}