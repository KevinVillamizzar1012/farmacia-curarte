package com.farmacia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;  // positivo para entrada, negativo para salida

    @Column(nullable = false)
    private String tipo;       // "VENTA", "COMPRA", "AJUSTE"

    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Nuevos campos
    private String proveedor;
    private String observaciones;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}