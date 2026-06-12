package com.farmacia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;          // Ruta de la imagen (ej: /uploads/banners/nombre.jpg)

    @Column(nullable = false)
    private Integer orden;       // Para ordenar en el carrusel

    @Column(nullable = false)
    private Boolean activo = true;  // Para ocultar sin eliminar

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // Constructor vacío
    public Banner() {}

    // Constructor con parámetros
    public Banner(String url, Integer orden, Boolean activo) {
        this.url = url;
        this.orden = orden;
        this.activo = activo;
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}