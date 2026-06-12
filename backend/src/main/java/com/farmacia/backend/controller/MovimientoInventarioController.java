package com.farmacia.backend.controller;

import com.farmacia.backend.dto.CompraRequestDTO;
import com.farmacia.backend.dto.MovimientoInventarioDTO;
import com.farmacia.backend.entity.MovimientoInventario;
import com.farmacia.backend.service.MovimientoInventarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario/movimientos")
public class MovimientoInventarioController {

    @Autowired
    private MovimientoInventarioService service;

    @GetMapping
    public List<MovimientoInventarioDTO> listarMovimientos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return service.obtenerMovimientos(inicio, fin);
    }

    @PostMapping("/compras")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<?> registrarCompra(@Valid @RequestBody CompraRequestDTO request) {
        try {
            List<MovimientoInventario> movimientos = service.registrarCompra(request);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Compra registrada exitosamente",
                "movimientos", movimientos
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}