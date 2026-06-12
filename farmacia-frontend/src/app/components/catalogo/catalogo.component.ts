import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductoImagenService } from '../../services/producto-imagen.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private productoImagenService = inject(ProductoImagenService);
  private auth = inject(AuthService);
  private router = inject(Router);

  username = localStorage.getItem('username') || '';
  rol = localStorage.getItem('rol') || '';
  dropdownOpen = false;

  productos: Producto[] = [];
  terminoBusqueda = '';
  suggestions: Producto[] = [];
  showSuggestions = false;
  private searchTerms = new Subject<string>();

  paginaActual = 1;
  itemsPorPagina = 25;

  get productosFiltrados(): Producto[] {
    return this.productos;
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  showModal = false;
  editingProducto: Producto | null = null;

  filtrosForm = this.fb.group({
    nombre: [''],
    categoria: [''],
    disponible: [null as boolean | null]
  });

  productoForm = this.fb.group({
    nombre: ['', Validators.required],
    codigoBarras: [''],
    categoria: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]],
    fechaVencimiento: ['', Validators.required],
    descripcion: ['']
  });

  categorias = [
    'Analgésico', 'Antiinflamatorio', 'Antibiótico', 'Antihistamínico',
    'Gastrointestinal', 'Vitamina', 'Diabetes', 'Hipertensión',
    'Respiratorio', 'Corticoide', 'Antiplaquetario'
  ];

  ngOnInit(): void {
    this.buscar();
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
    this.filtrosForm.patchValue({ nombre: producto.nombre });
    this.buscar();
  }

  closeSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  buscar(): void {
    const filtros = this.filtrosForm.value;
    this.productoService.consultarProductos({
      nombre: filtros.nombre || undefined,
      categoria: filtros.categoria || undefined,
      disponible: filtros.disponible === null ? undefined : filtros.disponible
    }).subscribe(data => {
      this.productos = data;
      this.paginaActual = 1;
    });
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset({ nombre: '', categoria: '', disponible: null });
    this.buscar();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  abrirModal(producto?: Producto): void {
    if (producto) {
      this.editingProducto = producto;
      this.productoForm.patchValue({
        nombre: producto.nombre,
        codigoBarras: producto.codigoBarras || '',
        categoria: producto.categoria,
        precio: producto.precio,
        stock: producto.stock,
        stockMinimo: producto.stockMinimo,
        fechaVencimiento: producto.fechaVencimiento,
        descripcion: producto.descripcion || ''
      });
    } else {
      this.editingProducto = null;
      this.productoForm.reset({
        nombre: '',
        codigoBarras: '',
        categoria: '',
        precio: 0,
        stock: 0,
        stockMinimo: 0,
        fechaVencimiento: '',
        descripcion: ''
      });
    }
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.editingProducto = null;
    this.productoForm.reset();
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) return;
    const raw = this.productoForm.value;
    const productoData: any = {
      nombre: raw.nombre || undefined,
      codigoBarras: raw.codigoBarras || undefined,
      categoria: raw.categoria || undefined,
      precio: raw.precio ?? 0,
      stock: raw.stock ?? 0,
      stockMinimo: raw.stockMinimo ?? 0,
      fechaVencimiento: raw.fechaVencimiento || undefined,
      descripcion: raw.descripcion || undefined
    };
    if (this.editingProducto) {
      this.productoService.actualizarProducto(this.editingProducto.id, productoData).subscribe(() => {
        this.buscar();
        this.cerrarModal();
      });
    } else {
      this.productoService.crearProducto(productoData).subscribe(() => {
        this.buscar();
        this.cerrarModal();
      });
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => this.buscar());
    }
  }

  // Método auxiliar para obtener la URL completa de la imagen de un producto
  getImagenProducto(productoId: number): string {
    const prod = this.productos.find(p => p.id === productoId);
    if (prod && prod.imagenes && prod.imagenes.length > 0) {
      return `http://localhost:8080${prod.imagenes[0].url}`;
    }
    return 'no-image.png';
  }
}