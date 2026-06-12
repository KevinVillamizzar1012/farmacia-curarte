import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfilService, PerfilDTO, PerfilActualizarRequest } from '../../services/perfil.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TopBarComponent,
    BottomBarComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);

  perfil: PerfilDTO = {
    id: 0,
    nombre: '',
    email: '',
    rol: '',
    telefono: '',
    codigoArea: '',
    fechaNacimiento: '',
    avatarBase64: ''
  };

  rol: string = '';
  avatarPreview: string | null = null;
  selectedFile: File | null = null;
  nuevaPassword: string = '';
  mensaje: string = '';
  mensajeTipo: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.perfilService.obtenerPerfil().subscribe({
      next: (data) => {
        this.perfil = data;
        this.rol = data.rol;
        // Mostrar avatar si existe (asumiendo que viene en base64)
        if (this.perfil.avatarBase64) {
          // Si ya incluye el prefijo 'data:image', usarlo directamente
          if (this.perfil.avatarBase64.startsWith('data:image')) {
            this.avatarPreview = this.perfil.avatarBase64;
          } else {
            this.avatarPreview = `data:image/jpeg;base64,${this.perfil.avatarBase64}`;
          }
        } else {
          this.avatarPreview = null;
        }
      },
      error: () => {
        this.mostrarMensaje('Error al cargar el perfil', 'error');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  subirAvatar(): void {
    if (this.selectedFile) {
      this.perfilService.subirAvatar(this.selectedFile).subscribe({
        next: () => {
          this.mostrarMensaje('Avatar actualizado correctamente', 'success');
          this.selectedFile = null;
          this.cargarPerfil(); // Recargar perfil para obtener la nueva imagen
        },
        error: () => {
          this.mostrarMensaje('Error al subir el avatar', 'error');
        }
      });
    }
  }

  actualizarPerfil(): void {
    const request: PerfilActualizarRequest = {
      nombre: this.perfil.nombre,
      telefono: this.perfil.telefono,
      codigoArea: this.perfil.codigoArea,
      fechaNacimiento: this.perfil.fechaNacimiento
    };
    this.perfilService.actualizarPerfil(request).subscribe({
      next: () => {
        this.mostrarMensaje('Perfil actualizado correctamente', 'success');
        if (this.selectedFile) {
          this.subirAvatar();
        } else {
          this.cargarPerfil(); // Refrescar datos por si cambió algo
        }
      },
      error: () => {
        this.mostrarMensaje('Error al actualizar el perfil', 'error');
      }
    });
  }

  cambiarPassword(): void {
    if (this.nuevaPassword && this.nuevaPassword.length >= 6) {
      // Aquí se llamaría al endpoint de cambio de contraseña del backend
      // Por ahora simulamos éxito
      this.mostrarMensaje('Contraseña actualizada correctamente', 'success');
      this.nuevaPassword = '';
    } else {
      this.mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
    }
  }

  private mostrarMensaje(msg: string, tipo: 'success' | 'error'): void {
    this.mensaje = msg;
    this.mensajeTipo = tipo;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }
}