import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { VentaService, VentaRequest, ItemVenta } from '../../services/venta.service';
import { Producto } from '../../models/producto.model';
import { AuthService } from '../../services/auth.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-punto-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent, BottomBarComponent],
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.css']
})
export class PuntoVentaComponent implements OnInit {
  private productoService = inject(ProductoService);
  private ventaService = inject(VentaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Eliminamos username, rol, dropdownOpen (ahora los maneja TopBarComponent)

  busqueda = '';
  cantidad = 1;
  productoEncontrado: Producto | null = null;
  carrito: ItemCarrito[] = [];
  total = 0;

  // Modal
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  modalExtra = '';
  modalIcon = '';
  modalButtonText = '';
  modalType: 'confirm' | 'info' | 'success' | 'error' = 'info';
  private pendingAction: (() => void) | null = null;

  ngOnInit(): void {}

  // Búsqueda de producto
  buscarProducto() {
    const term = this.busqueda.trim();
    if (!term) return;
    if (/^\d+$/.test(term)) {
      this.productoService.buscarPorCodigoBarras(term).subscribe({
        next: (producto) => { this.productoEncontrado = producto; },
        error: () => { this.buscarPorNombre(term); }
      });
    } else { this.buscarPorNombre(term); }
  }

  private buscarPorNombre(term: string) {
    this.productoService.consultarProductos({ nombre: term }).subscribe({
      next: (productos) => {
        if (productos.length === 0) {
          this.mostrarModal('Producto no encontrado', 'No se encontró ningún producto con ese nombre o código.', 'error', 'Entendido');
          this.productoEncontrado = null;
        } else { this.productoEncontrado = productos[0]; }
      },
      error: () => this.mostrarModal('Error', 'Error al buscar producto', 'error', 'Cerrar')
    });
  }

  // Carrito
  agregarAlCarrito() {
    if (!this.productoEncontrado) return;
    if (this.cantidad < 1 || this.cantidad > this.productoEncontrado.stock) {
      this.mostrarModal('Cantidad inválida', `La cantidad debe estar entre 1 y ${this.productoEncontrado.stock}.`, 'error', 'Aceptar');
      return;
    }
    const itemIndex = this.carrito.findIndex(i => i.producto.id === this.productoEncontrado!.id);
    if (itemIndex !== -1) {
      const nuevaCantidad = this.carrito[itemIndex].cantidad + this.cantidad;
      if (nuevaCantidad > this.productoEncontrado.stock) {
        this.mostrarModal('Stock insuficiente', 'No se puede agregar más cantidad, excede el stock disponible.', 'error', 'Aceptar');
        return;
      }
      this.carrito[itemIndex].cantidad = nuevaCantidad;
      this.carrito[itemIndex].subtotal = nuevaCantidad * this.productoEncontrado.precio;
    } else {
      this.carrito.push({
        producto: this.productoEncontrado,
        cantidad: this.cantidad,
        subtotal: this.cantidad * this.productoEncontrado.precio
      });
    }
    this.recalcularTotal();
    this.productoEncontrado = null;
    this.busqueda = '';
    this.cantidad = 1;
  }

  eliminarDelCarrito(index: number) { this.carrito.splice(index, 1); this.recalcularTotal(); }
  recalcularTotal() { this.total = this.carrito.reduce((sum, item) => sum + item.subtotal, 0); }

  // Ventana de confirmación
  abrirModalConfirmacion() {
    if (this.carrito.length === 0) return;
    this.modalTitle = 'Confirmar venta';
    this.modalMessage = `¿Está seguro de confirmar la venta por \$${this.total}?`;
    this.modalExtra = '';
    this.modalIcon = 'bi bi-question-circle-fill';
    this.modalButtonText = 'Confirmar';
    this.modalType = 'confirm';
    this.pendingAction = () => this.procesarVenta();
    this.modalVisible = true;
  }

  procesarVenta() {
    const usuarioId = parseInt(localStorage.getItem('usuarioId') || '0');
    if (usuarioId === 0) {
      this.mostrarModal('Error de autenticación', 'No se ha identificado al usuario. Inicie sesión nuevamente.', 'error', 'Cerrar');
      return;
    }
    const items: ItemVenta[] = this.carrito.map(item => ({ productoId: item.producto.id, cantidad: item.cantidad }));
    const venta: VentaRequest = { usuarioId, items };
    this.ventaService.registrarVenta(venta).subscribe({
      next: (respuesta: any) => {
        const idVenta = respuesta.id;
        this.mostrarModal('Venta exitosa', 'La venta se ha registrado correctamente.', 'success', 'OK', idVenta);
        this.carrito = [];
        this.total = 0;
      },
      error: (err) => {
        console.error(err);
        this.mostrarModal('Error al registrar venta', err.error?.mensaje || 'Ocurrió un error inesperado.', 'error', 'Cerrar');
      }
    });
  }

  mostrarModal(titulo: string, mensaje: string, tipo: 'confirm' | 'info' | 'success' | 'error', textoBoton: string, idVenta?: number) {
    this.modalTitle = titulo;
    this.modalMessage = mensaje;
    this.modalExtra = idVenta ? `ID de venta: ${idVenta}` : '';
    this.modalButtonText = textoBoton;
    this.modalType = tipo;
    if (tipo === 'success') this.modalIcon = 'bi bi-check-circle-fill text-success';
    else if (tipo === 'error') this.modalIcon = 'bi bi-x-circle-fill text-danger';
    else if (tipo === 'confirm') this.modalIcon = 'bi bi-question-circle-fill text-warning';
    else this.modalIcon = 'bi bi-info-circle-fill text-info';
    this.pendingAction = null;
    this.modalVisible = true;
  }

  ejecutarAccion() {
    if (this.modalType === 'confirm' && this.pendingAction) {
      this.pendingAction();
    }
    this.cerrarModal();
  }

  cerrarModal() {
    this.modalVisible = false;
    this.pendingAction = null;
  }
}