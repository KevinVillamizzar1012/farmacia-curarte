import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TopBarComponent,
    BottomBarComponent
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.email]],
    codigoArea: [''],
    telefono: [''],
    fechaNacimiento: [''],
    password: ['', Validators.required],
    confirmarPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmarPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      let errorMsg = 'Corrige los siguientes errores:\n';
      if (this.registroForm.hasError('passwordMismatch')) {
        errorMsg += '- Las contraseñas no coinciden\n';
      }
      const controls = this.registroForm.controls;
      if (controls.nombre.invalid) errorMsg += '- Nombre es obligatorio\n';
      if (controls.apellido.invalid) errorMsg += '- Apellido es obligatorio\n';
      if (controls.username.invalid) errorMsg += '- Usuario es obligatorio\n';
      if (controls.password.invalid) errorMsg += '- Contraseña es obligatoria\n';
      if (controls.confirmarPassword.invalid) errorMsg += '- Confirmar contraseña es obligatorio\n';
      if (controls.email.invalid && controls.email.value) errorMsg += '- Email no es válido\n';
      alert(errorMsg);
      return;
    }

    const formValue = this.registroForm.value;
    const userData = {
      username: formValue.username!,
      password: formValue.password!,
      email: formValue.email || undefined,
      nombre: formValue.nombre!,
      apellido: formValue.apellido!,
      fechaNacimiento: formValue.fechaNacimiento || undefined,
      codigoArea: formValue.codigoArea || undefined,
      telefono: formValue.telefono || undefined,
      rol: 'CLIENTE'
    };
    this.auth.register(userData).subscribe({
      next: () => {
        alert('Registro exitoso. Ahora inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error en el registro. El usuario podría existir o faltan datos.');
      }
    });
  }
}