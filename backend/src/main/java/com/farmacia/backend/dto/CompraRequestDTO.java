package com.farmacia.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CompraRequestDTO {
    @NotNull(message = "La lista de items no puede ser nula")
    @Size(min = 1, message = "Debe haber al menos un producto")
    private List<@Valid ItemCompraDTO> items;

    private String proveedor;
    private String observaciones;

    // Getters y setters
    public List<ItemCompraDTO> getItems() { return items; }
    public void setItems(List<ItemCompraDTO> items) { this.items = items; }
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public static class ItemCompraDTO {
        @NotNull(message = "El ID del producto es obligatorio")
        @Positive(message = "El ID del producto debe ser positivo")
        private Long productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @Positive(message = "La cantidad debe ser mayor a 0")
        private Integer cantidad;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}