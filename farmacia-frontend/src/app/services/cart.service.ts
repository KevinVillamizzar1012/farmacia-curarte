import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'farmacia_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(this.cartKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addProduct(producto: Producto, cantidad: number = 1): void {
    const cart = this.loadCart();
    const index = cart.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      cart[index].cantidad += cantidad;
    } else {
      cart.push({ producto, cantidad });
    }
    this.saveCart(cart);
  }

  updateQuantity(productoId: number, cantidad: number): void {
    const cart = this.loadCart();
    const index = cart.findIndex(item => item.producto.id === productoId);
    if (index !== -1) {
      if (cantidad <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].cantidad = cantidad;
      }
      this.saveCart(cart);
    }
  }

  removeProduct(productoId: number): void {
    const cart = this.loadCart();
    const filtered = cart.filter(item => item.producto.id !== productoId);
    this.saveCart(filtered);
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartSubject.next([]);
  }

  getTotal(): number {
    return this.loadCart().reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }
}