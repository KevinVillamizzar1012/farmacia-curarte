package com.farmacia.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public class VentaRequestDTO {
    @NotNull(message = "usuarioId es obligatorio")
    @Positive(message = "usuarioId debe ser positivo")
    private Long usuarioId;

    @NotNull(message = "items no puede ser nulo")
    @Size(min = 1, message = "Debe haber al menos un item")
    private List<@Valid ItemVentaDTO> items;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public List<ItemVentaDTO> getItems() { return items; }
    public void setItems(List<ItemVentaDTO> items) { this.items = items; }

    public static class ItemVentaDTO {
        @NotNull(message = "productoId es obligatorio")
        @Positive(message = "productoId debe ser positivo")
        private Long productoId;

        @NotNull(message = "cantidad es obligatoria")
        @Positive(message = "cantidad debe ser mayor a 0")
        private Integer cantidad;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}