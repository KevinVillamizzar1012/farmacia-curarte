package com.farmacia.backend.dto;

import java.time.LocalDateTime;

public class VentaResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private Double total;
    private Long usuarioId;

    public VentaResponseDTO(Long id, LocalDateTime fecha, Double total, Long usuarioId) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.usuarioId = usuarioId;
    }

    public Long getId() { return id; }
    public LocalDateTime getFecha() { return fecha; }
    public Double getTotal() { return total; }
    public Long getUsuarioId() { return usuarioId; }
}