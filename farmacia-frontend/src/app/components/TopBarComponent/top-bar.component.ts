import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private perfilService = inject(PerfilService);
  private router = inject(Router);

  @Input() cartItemsCount: number = 0;
  @Input() showCart: boolean = true;   // ← controla si se muestra el botón carrito
  @Output() cartClick = new EventEmitter<void>();

  isLoggedIn = false;
  username = '';
  rol = '';
  avatarUrl = '';
  dropdownOpen = false;
  private avatarSubscription?: Subscription;
  homeLink: string = '/';

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    if (this.isLoggedIn) {
      this.username = localStorage.getItem('username') || '';
      this.rol = localStorage.getItem('rol') || '';
      this.cargarAvatar();
      this.homeLink = '/inicio';
    } else {
      this.homeLink = '/';
    }
  }

  cargarAvatar(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.avatarSubscription = this.perfilService.obtenerAvatarUrl(Number(userId)).subscribe({
        next: (url: string) => { this.avatarUrl = url; },
        error: () => { this.avatarUrl = ''; }
      });
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onCartClick(): void {
    this.cartClick.emit();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  registro(): void {
    this.router.navigate(['/registro']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.avatarSubscription) this.avatarSubscription.unsubscribe();
  }
}