export interface ProductoImagen {
  id: number;
  url: string;
  orden: number;
}

export interface Producto {
  id: number;
  nombre: string;
  codigoBarras?: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  fechaVencimiento: string;
  descripcion?: string;
  activo?: boolean;
  imagenes?: ProductoImagen[];
}