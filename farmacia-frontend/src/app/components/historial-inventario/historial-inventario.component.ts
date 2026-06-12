import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovimientoService, MovimientoInventario, CompraRequest } from '../../services/movimiento.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-historial-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent, BottomBarComponent],
  templateUrl: './historial-inventario.component.html',
  styleUrls: ['./historial-inventario.component.css']
})
export class HistorialInventarioComponent implements OnInit {
  private movimientoService = inject(MovimientoService);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  movimientos: MovimientoInventario[] = [];
  productos: Producto[] = [];

  paginaActual = 1;
  itemsPorPagina = 10;
  get totalPaginas(): number {
    return Math.ceil(this.movimientos.length / this.itemsPorPagina);
  }

  showCompraModal = false;
  compraData = {
    items: [{ productoId: 0, cantidad: 1 }],
    proveedor: '',
    observaciones: ''
  };

  ngOnInit(): void {
    this.cargarMovimientos();
    this.cargarProductos();
  }

  cargarMovimientos() {
    this.movimientoService.listarMovimientos().subscribe(data => {
      this.movimientos = data;
      this.paginaActual = 1;
    });
  }

  cargarProductos() {
    this.productoService.consultarProductos().subscribe(data => this.productos = data);
  }

  abrirModalCompra() {
    this.compraData = {
      items: [{ productoId: 0, cantidad: 1 }],
      proveedor: '',
      observaciones: ''
    };
    this.showCompraModal = true;
  }

  cerrarModalCompra() { this.showCompraModal = false; }

  agregarItemCompra() {
    this.compraData.items.push({ productoId: 0, cantidad: 1 });
  }

  eliminarItemCompra(index: number) {
    this.compraData.items.splice(index, 1);
  }

  guardarCompra() {
    for (let item of this.compraData.items) {
      if (item.productoId === 0) {
        alert('Seleccione un producto para todos los items');
        return;
      }
      if (item.cantidad < 1) {
        alert('La cantidad debe ser mayor a 0');
        return;
      }
    }
    const request: CompraRequest = {
      items: this.compraData.items,
      proveedor: this.compraData.proveedor,
      observaciones: this.compraData.observaciones
    };
    this.movimientoService.registrarCompra(request).subscribe({
      next: () => {
        alert('Compra registrada exitosamente');
        this.cargarMovimientos();
        this.cerrarModalCompra();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar la compra');
      }
    });
  }
}