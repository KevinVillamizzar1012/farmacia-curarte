package com.farmacia.backend.controller;

import com.farmacia.backend.entity.Producto;
import com.farmacia.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;
    
    // Consulta con filtro opcional por nombre (insensible a mayúsculas y parcial)
    @GetMapping("/consultar")
    public List<Producto> consultarProductos(@RequestParam(required = false) String nombre) {
        if (nombre != null && !nombre.isEmpty()) {
            return productoRepository.findByNombreContainingIgnoreCase(nombre);
        }
        return productoRepository.findAll();
    }
    
    @GetMapping("/consultar/nombre/{nombre}")
    public List<Producto> consultarPorNombre(@PathVariable String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @GetMapping("/codigo/{codigoBarras}")
    public ResponseEntity<Producto> buscarPorCodigoBarras(@PathVariable String codigoBarras) {
        Producto producto = productoRepository.findByCodigoBarras(codigoBarras);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }
    
    @PostMapping("/admin/crear")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto crear(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }
    
    @PutMapping("/admin/actualizar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setId(id);
        return productoRepository.save(producto);
    }
    
    @DeleteMapping("/admin/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        productoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/admin/stock-bajo")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public List<Producto> stockBajo() {
        return productoRepository.findProductosConStockBajo();
    }

    @GetMapping("/admin/proximos-vencer")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public List<Producto> proximosVencer(@RequestParam(defaultValue = "30") int dias) {
        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusDays(dias);
        return productoRepository.findByFechaVencimientoBetween(hoy, limite);
    }
}