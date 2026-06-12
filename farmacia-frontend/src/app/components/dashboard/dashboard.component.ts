import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = localStorage.getItem('username') || '';
  rol = localStorage.getItem('rol') || '';
  dropdownOpen = false;
  terminoBusqueda = '';
  suggestions: Producto[] = [];
  showSuggestions = false;
  private searchTerms = new Subject<string>();

  private auth = inject(AuthService);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  stockBajo: Producto[] = [];
  proximosVencer: Producto[] = [];

  ngOnInit(): void {
    if (this.rol !== 'CLIENTE') {
      this.productoService.getStockBajo().subscribe(data => this.stockBajo = data);
      this.productoService.getProximosVencer(30).subscribe(data => this.proximosVencer = data);
    }

    // Búsqueda con debounce y sugerencias
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.productoService.consultarProductos({ nombre: term }) : [])
    ).subscribe(data => {
      this.suggestions = data;
      this.showSuggestions = data.length > 0;
    });
  }

  onSearchInput(): void {
    this.searchTerms.next(this.terminoBusqueda);
  }

  selectSuggestion(producto: Producto): void {
    this.terminoBusqueda = producto.nombre;
    this.showSuggestions = false;
    this.buscar(); // opcional: redirige al catálogo
  }

  buscar(): void {
    if (this.terminoBusqueda.trim()) {
      this.showSuggestions = false;
      this.router.navigate(['/catalogo'], { queryParams: { nombre: this.terminoBusqueda } });
    }
  }

  closeSuggestions(): void {
    setTimeout(() => { this.showSuggestions = false; }, 200);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}