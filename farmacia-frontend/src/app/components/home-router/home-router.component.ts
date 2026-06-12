import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-router',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="loading">Cargando...</div>`,
  styles: [`.loading { text-align: center; margin-top: 2rem; font-family: 'Numans', sans-serif; }`]
})
export class HomeRouterComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const rol = localStorage.getItem('rol');
    switch (rol) {
      case 'ADMIN':
        this.router.navigate(['/admin-home']);
        break;
      case 'EMPLEADO':
        this.router.navigate(['/empleado-home']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/cliente-home']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}