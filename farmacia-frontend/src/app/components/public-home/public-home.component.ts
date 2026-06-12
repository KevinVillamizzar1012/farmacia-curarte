import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';
import { BannerService, Banner } from '../../services/banner.service';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TopBarComponent,
    BottomBarComponent
  ],
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.css']
})
export class PublicHomeComponent implements OnInit {
  private productoService = inject(ProductoService);
  private bannerService = inject(BannerService);
  private router = inject(Router);

  terminoBusqueda = '';
  productosDestacados: Producto[] = [];
  categorias: string[] = [
    'Farmacia', 'Cuidado Personal', 'Naturales y Homeopáticas', 'Dermocosmética',
    'Bebés', 'Vitaminas', 'Primeros Auxilios'
  ];

  suggestions: Producto[] = [];
  showSuggestions = false;
  private searchTerms = new Subject<string>();

  banners: Banner[] = [];
  currentBannerIndex = 0;

  ngOnInit(): void {
    this.cargarBanners();
    this.cargarProductos();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.productoService.consultarProductos({ nombre: term }) : [])
    ).subscribe(data => {
      this.suggestions = data;
      this.showSuggestions = data.length > 0;
    });
  }

  cargarBanners(): void {
    this.bannerService.getBannersActivos().subscribe(data => this.banners = data);
  }

  cargarProductos(): void {
    this.productoService.consultarProductos().subscribe(data => {
      this.productosDestacados = data.slice(0, 6);
    });
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
      this.showSuggestions = false;
      this.router.navigate(['/catalogo'], { queryParams: { nombre: this.terminoBusqueda } });
    }
  }

  nextBanner(): void {
    if (this.banners.length === 0) return;
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  prevBanner(): void {
    if (this.banners.length === 0) return;
    this.currentBannerIndex = (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }

  goToBanner(index: number): void {
    if (index >= 0 && index < this.banners.length) this.currentBannerIndex = index;
  }

  getFullBannerUrl(banner: Banner): string {
    return this.bannerService.getFullImageUrl(banner.url);
  }

  getImagenProducto(id: number): string {
    return `https://picsum.photos/id/${id % 100}/200/200`;
  }

  getImagenCategoria(categoria: string): string {
    let hash = 0;
    for (let i = 0; i < categoria.length; i++) hash = (hash << 5) - hash + categoria.charCodeAt(i);
    const id = Math.abs(hash) % 100;
    return `https://picsum.photos/id/${id}/200/200`;
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  scrollProductos(direction: number): void {
    const container = document.querySelector('#productosTrack') as HTMLElement;
    if (container) container.scrollLeft += direction * 250;
  }
}