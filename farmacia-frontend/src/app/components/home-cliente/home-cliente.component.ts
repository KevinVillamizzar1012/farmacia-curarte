import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TopBarComponent } from '../TopBarComponent/top-bar.component';
import { BottomBarComponent } from '../BottomBarComponent/bottom-bar.component';
import { BannerService, Banner } from '../../services/banner.service';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TopBarComponent, BottomBarComponent],
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent implements OnInit, OnDestroy, AfterViewInit {
  private cartService = inject(CartService);
  private productoService = inject(ProductoService);
  private bannerService = inject(BannerService);

  @ViewChild('productosTrack') productosTrack!: ElementRef;

  carritoItems: CartItem[] = [];
  showCartModal = false;
  private cartSubscription?: Subscription;

  terminoBusqueda = '';
  suggestions: Producto[] = [];
  showSuggestions = false;
  private searchTerms = new Subject<string>();

  productos: Producto[] = [];
  productosDestacados: Producto[] = [];
  ultimasCompras: any[] = [];

  categorias: string[] = [
    'Farmacia', 'Cuidado Personal', 'Naturales y Homeopáticas', 'Dermocosmética',
    'Bebés', 'Vitaminas', 'Primeros Auxilios'
  ];

  banners: Banner[] = [];
  currentBannerIndex = 0;
  private bannerInterval: any;

  showConfirmMessage = false;
  confirmMessage = '';

  ngOnInit(): void {
    this.cargarBanners();
    this.cargarProductos();
    this.cargarProductosDestacados();
    this.cargarUltimasCompras();
    this.iniciarCarruselAutomatico();

    this.cartSubscription = this.cartService.getCart().subscribe(items => this.carritoItems = items);

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.productoService.consultarProductos({ nombre: term }) : [])
    ).subscribe(data => {
      this.suggestions = data;
      this.showSuggestions = data.length > 0;
    });
  }

  ngAfterViewInit() {}
  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
    if (this.bannerInterval) clearInterval(this.bannerInterval);
  }

  cargarBanners(): void {
    this.bannerService.getBannersActivos().subscribe(data => this.banners = data);
  }

  cargarProductos() {
    this.productoService.consultarProductos({}).subscribe(data => this.productos = data);
  }
  cargarProductosDestacados() {
    this.productoService.consultarProductos({}).subscribe(data => this.productosDestacados = data.slice(0, 6));
  }
  cargarUltimasCompras() {
    this.ultimasCompras = [];
  }

  onSearchInput() { this.searchTerms.next(this.terminoBusqueda); }
  selectSuggestion(producto: Producto) {
    this.terminoBusqueda = producto.nombre;
    this.showSuggestions = false;
    this.buscar();
  }
  closeSuggestions() { setTimeout(() => this.showSuggestions = false, 200); }
  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.productoService.consultarProductos({ nombre: this.terminoBusqueda }).subscribe(data => this.productos = data);
    } else {
      this.cargarProductos();
    }
  }

  iniciarCarruselAutomatico() {
    this.bannerInterval = setInterval(() => this.nextBanner(), 5000);
  }
  nextBanner() {
    if (this.banners.length === 0) return;
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }
  prevBanner() {
    if (this.banners.length === 0) return;
    this.currentBannerIndex = (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
  }
  goToBanner(index: number) {
    if (index >= 0 && index < this.banners.length) this.currentBannerIndex = index;
  }

  getFullBannerUrl(banner: Banner): string {
    return this.bannerService.getFullImageUrl(banner.url);
  }

  scrollProductos(direction: number) {
    if (this.productosTrack) {
      this.productosTrack.nativeElement.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  }

  navegarPorCategoria(categoria: string) {
    this.terminoBusqueda = '';
    this.productoService.consultarProductos({ categoria }).subscribe(data => {
      this.productos = data;
      document.querySelector('.productos-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  agregarAlCarrito(producto: Producto, cantidad = 1) {
    this.cartService.addProduct(producto, cantidad);
    this.mostrarToast(`${producto.nombre} agregado al carrito`);
  }

  incrementarCantidad(item: CartItem) {
    const producto = item.producto;
    const nuevaCantidad = item.cantidad + 1;
    if (nuevaCantidad <= (producto.stock || 999)) {
      this.cartService.updateQuantity(producto.id, nuevaCantidad);
    } else {
      this.mostrarToast('Stock insuficiente');
    }
  }

  decrementarCantidad(item: CartItem) {
    const producto = item.producto;
    if (item.cantidad > 1) {
      this.cartService.updateQuantity(producto.id, item.cantidad - 1);
    } else {
      this.cartService.removeProduct(producto.id);
    }
  }

  actualizarCantidad(item: CartItem, nuevaCantidad: number) {
    const producto = item.producto;
    if (nuevaCantidad > (producto.stock || 999)) {
      this.mostrarToast('Stock insuficiente');
      return;
    }
    if (nuevaCantidad < 1) {
      this.cartService.removeProduct(producto.id);
    } else {
      this.cartService.updateQuantity(producto.id, nuevaCantidad);
    }
  }

  eliminarDelCarrito(item: CartItem) {
    this.cartService.removeProduct(item.producto.id);
    this.mostrarToast(`${item.producto.nombre} eliminado`);
  }

  get cartTotal(): number {
    return this.cartService.getTotal();
  }

  abrirCarrito() { this.showCartModal = true; }
  cerrarCarrito() { this.showCartModal = false; }

  realizarPedido() {
    this.cartService.clearCart();
    this.cerrarCarrito();
    this.mostrarToast('Pedido realizado con éxito');
  }

  private mostrarToast(mensaje: string) {
    this.confirmMessage = mensaje;
    this.showConfirmMessage = true;
    setTimeout(() => this.showConfirmMessage = false, 1500);
  }

  getImagenProducto(productoId: number): string {
    const prod = this.productos.find(p => p.id === productoId) || this.productosDestacados.find(p => p.id === productoId);
    if (prod && prod.imagenes && prod.imagenes.length > 0) {
      return `http://localhost:8080${prod.imagenes[0].url}`;
    }
    return 'no-image.png';
  }

  // ✅ Imágenes de stock para las categorías (usando Lorem Picsum)
  getImagenCategoria(categoria: string): string {
    let hash = 0;
    for (let i = 0; i < categoria.length; i++) {
      hash = (hash << 5) - hash + categoria.charCodeAt(i);
      hash |= 0;
    }
    const id = Math.abs(hash) % 100;
    return `https://picsum.photos/id/${id}/200/200`;
  }
}