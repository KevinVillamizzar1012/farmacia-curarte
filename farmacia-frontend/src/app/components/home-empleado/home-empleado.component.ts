import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { ReporteService } from '../../services/reporte.service';
import { Producto } from '../../models/producto.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';

@Component({
  selector: 'app-home-empleado',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TopBarComponent,
    BottomBarComponent
  ],
  templateUrl: './home-empleado.component.html',
  styleUrls: ['./home-empleado.component.css']
})
export class HomeEmpleadoComponent implements OnInit {
  // Eliminamos username, rol, dropdownOpen, toggleDropdown, logout
  // porque ahora los maneja TopBarComponent

  private auth = inject(AuthService);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private reporteService = inject(ReporteService);

  ventasHoy = 0;
  stockBajo: Producto[] = [];
  proximosVencer: Producto[] = [];

  terminoBusqueda = '';
  suggestions: Producto[] = [];
  showSuggestions = false;
  private searchTerms = new Subject<string>();

  ngOnInit(): void {
    this.cargarDatos();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.productoService.consultarProductos({ nombre: term }) : [])
    ).subscribe(data => {
      this.suggestions = data;
      this.showSuggestions = data.length > 0;
    });
  }

  cargarDatos(): void {
    this.reporteService.obtenerVentasHoy().subscribe(total => this.ventasHoy = total);
    this.productoService.getStockBajo().subscribe(data => this.stockBajo = data);
    this.productoService.getProximosVencer(30).subscribe(data => this.proximosVencer = data);
  }

  onSearchInput(): void {
    this.searchTerms.next(this.terminoBusqueda);
  }

  selectSuggestion(producto: Producto): void {
    this.terminoBusqueda = producto.nombre;
    this.showSuggestions = false;
    this.buscar();
  }

  closeSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  buscar(): void {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/catalogo'], { queryParams: { nombre: this.terminoBusqueda } });
    }
  }
}