import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TopBarComponent,
    BottomBarComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.auth.login(this.loginForm.value as any).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: () => alert('Credenciales incorrectas')
    });
  }
}