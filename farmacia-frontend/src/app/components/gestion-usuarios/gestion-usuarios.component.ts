import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario, UsuarioRequest } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TopBarComponent, BottomBarComponent],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Eliminamos username, rol, dropdownOpen (los maneja TopBarComponent)

  usuarios: Usuario[] = [];
  showModal = false;
  usuarioEditado: Usuario | null = null;

  paginaActual = 1;
  itemsPorPagina = 10;
  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.itemsPorPagina);
  }

  usuarioForm = this.fb.group({
    username: ['', Validators.required],
    nombre: [''],
    apellido: [''],
    email: ['', Validators.email],
    password: [''],
    rol: ['CLIENTE', Validators.required]
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
      this.paginaActual = 1;
    });
  }

  abrirModal(usuario?: Usuario) {
    if (usuario) {
      this.usuarioEditado = usuario;
      this.usuarioForm.patchValue({
        username: usuario.username,
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        rol: usuario.rol
      });
    } else {
      this.usuarioEditado = null;
      this.usuarioForm.reset({ username: '', nombre: '', apellido: '', email: '', password: '', rol: 'CLIENTE' });
    }
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.usuarioEditado = null;
    this.usuarioForm.reset();
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) return;
    const formValue = this.usuarioForm.value;
    const request: UsuarioRequest = {
      username: formValue.username!,
      nombre: formValue.nombre || undefined,
      apellido: formValue.apellido || undefined,
      email: formValue.email || undefined,
      password: formValue.password || undefined,
      rol: formValue.rol!
    };
    if (this.usuarioEditado) {
      this.usuarioService.actualizar(this.usuarioEditado.id, request).subscribe(() => {
        this.cargarUsuarios();
        this.cerrarModal();
      });
    } else {
      if (!request.password) {
        alert('La contraseña es obligatoria para nuevos usuarios');
        return;
      }
      this.usuarioService.crear(request).subscribe(() => {
        this.cargarUsuarios();
        this.cerrarModal();
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar usuario?')) {
      this.usuarioService.eliminar(id).subscribe(() => this.cargarUsuarios());
    }
  }

  // Ya no necesitamos toggleDropdown ni logout
}