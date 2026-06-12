package com.farmacia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String categoria;
    private String codigoBarras;
    private Integer stock;
    private Integer stockMinimo;
    private Integer stockMaximo;
    private Double precio;
    private LocalDate fechaVencimiento;
    
    @Column(length = 500)
    private String descripcion;

    // Nueva relación con imágenes
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ProductoImagen> imagenes = new ArrayList<>();

    // Métodos helper para manejar la relación
    public void agregarImagen(ProductoImagen imagen) {
        imagenes.add(imagen);
        imagen.setProducto(this);
    }

    public void removerImagen(ProductoImagen imagen) {
        imagenes.remove(imagen);
        imagen.setProducto(null);
    }

    // Getters y Setters originales
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }

    public Integer getStockMaximo() { return stockMaximo; }
    public void setStockMaximo(Integer stockMaximo) { this.stockMaximo = stockMaximo; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    // Getter y Setter para la lista de imágenes
    public List<ProductoImagen> getImagenes() { return imagenes; }
    public void setImagenes(List<ProductoImagen> imagenes) { this.imagenes = imagenes; }
}