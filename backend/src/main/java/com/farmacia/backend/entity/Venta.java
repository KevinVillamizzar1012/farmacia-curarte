package com.farmacia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventas")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Double total;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detalles = new ArrayList<>();

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<DetalleVenta> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVenta> detalles) { this.detalles = detalles; }
}