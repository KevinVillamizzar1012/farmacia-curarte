package com.farmacia.backend.dto;

import java.time.LocalDateTime;

public class MovimientoInventarioDTO {
    private Long id;
    private String productoNombre;
    private Integer cantidad;
    private String tipo;
    private String descripcion;
    private LocalDateTime fecha;
    private String usuarioNombre;
    private String proveedor;
    private String observaciones;

    public MovimientoInventarioDTO(Long id, String productoNombre, Integer cantidad, String tipo,
                                   String descripcion, LocalDateTime fecha, String usuarioNombre,
                                   String proveedor, String observaciones) {
        this.id = id;
        this.productoNombre = productoNombre;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.usuarioNombre = usuarioNombre;
        this.proveedor = proveedor;
        this.observaciones = observaciones;
    }

    // Getters
    public Long getId() { return id; }
    public String getProductoNombre() { return productoNombre; }
    public Integer getCantidad() { return cantidad; }
    public String getTipo() { return tipo; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFecha() { return fecha; }
    public String getUsuarioNombre() { return usuarioNombre; }
    public String getProveedor() { return proveedor; }
    public String getObservaciones() { return observaciones; }
}