import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerService, Banner } from '../../services/banner.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-gestion-banners',
  standalone: true,
  imports: [CommonModule, FormsModule, TopBarComponent, BottomBarComponent],
  templateUrl: './gestion-banners.component.html',
  styleUrls: ['./gestion-banners.component.css']
})
export class GestionBannersComponent implements OnInit {
  private bannerService = inject(BannerService);

  banners: Banner[] = [];
  selectedFile: File | null = null;
  nuevoOrden: number = 1;
  cargando = false;
  mensaje = '';
  mensajeTipo = 'success';

  ngOnInit(): void {
    this.cargarBanners();
  }

  cargarBanners(): void {
    this.bannerService.listarTodos().subscribe({
      next: (data) => this.banners = data,
      error: () => this.mostrarMensaje('Error al cargar banners', 'error')
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  subirBanner(): void {
    if (!this.selectedFile) {
      this.mostrarMensaje('Seleccione una imagen', 'error');
      return;
    }
    if (this.nuevoOrden < 0) {
      this.mostrarMensaje('El orden debe ser un número positivo', 'error');
      return;
    }
    this.cargando = true;
    this.bannerService.subirBanner(this.selectedFile, this.nuevoOrden).subscribe({
      next: () => {
        this.mostrarMensaje('Banner subido correctamente', 'success');
        this.selectedFile = null;
        this.nuevoOrden = 1;
        this.cargarBanners();
        this.cargando = false;
      },
      error: (err) => {
        this.mostrarMensaje('Error al subir banner: ' + (err.error?.message || err.message), 'error');
        this.cargando = false;
      }
    });
  }

  actualizarOrden(banner: Banner, nuevoOrden: number): void {
    if (nuevoOrden === banner.orden) return;
    this.bannerService.actualizarOrden(banner.id, nuevoOrden).subscribe({
      next: () => {
        this.mostrarMensaje('Orden actualizado', 'success');
        this.cargarBanners();
      },
      error: () => this.mostrarMensaje('Error al actualizar orden', 'error')
    });
  }

  toggleEstado(banner: Banner): void {
    this.bannerService.actualizarEstado(banner.id, !banner.activo).subscribe({
      next: () => {
        this.mostrarMensaje(`Banner ${banner.activo ? 'ocultado' : 'activado'}`, 'success');
        this.cargarBanners();
      },
      error: () => this.mostrarMensaje('Error al cambiar estado', 'error')
    });
  }

  eliminarBanner(id: number): void {
    if (confirm('¿Eliminar este banner permanentemente?')) {
      this.bannerService.eliminarBanner(id).subscribe({
        next: () => {
          this.mostrarMensaje('Banner eliminado', 'success');
          this.cargarBanners();
        },
        error: () => this.mostrarMensaje('Error al eliminar banner', 'error')
      });
    }
  }

  getFullImageUrl(url: string): string {
    return this.bannerService.getFullImageUrl(url);
  }

  private mostrarMensaje(msg: string, tipo: 'success' | 'error'): void {
    this.mensaje = msg;
    this.mensajeTipo = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }
}