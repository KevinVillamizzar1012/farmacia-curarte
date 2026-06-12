package com.farmacia.backend.controller;

import com.farmacia.backend.dto.VentaRequestDTO;
import com.farmacia.backend.dto.VentaResponseDTO;
import com.farmacia.backend.dto.VentaReporteDTO;
import com.farmacia.backend.entity.Venta;
import com.farmacia.backend.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping("/registrar")
    @PreAuthorize("hasAnyRole('EMPLEADO', 'ADMIN')")
    public ResponseEntity<?> registrarVenta(@Valid @RequestBody VentaRequestDTO request) {
        try {
            Venta venta = ventaService.registrarVenta(request);
            VentaResponseDTO response = new VentaResponseDTO(
                venta.getId(),
                venta.getFecha(),
                venta.getTotal(),
                venta.getUsuario().getId()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reportes/ventas")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<?> ventasPorFecha(@RequestParam String inicio, @RequestParam String fin) {
        try {
            LocalDateTime start = LocalDateTime.parse(inicio + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(fin + "T23:59:59");
            List<Venta> ventas = ventaService.obtenerVentasPorFecha(start, end);
            List<VentaReporteDTO> result = ventas.stream()
                .map(v -> new VentaReporteDTO(
                    v.getId(),
                    v.getFecha(),
                    v.getTotal(),
                    v.getUsuario() != null ? v.getUsuario().getId() : null
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reportes/ventas-hoy")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<Double> ventasHoy() {
        try {
            LocalDateTime start = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            LocalDateTime end = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
            List<Venta> ventas = ventaService.obtenerVentasPorFecha(start, end);
            Double total = ventas.stream().mapToDouble(Venta::getTotal).sum();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @GetMapping("/reportes/productos-mas-vendidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> productosMasVendidos(
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fin) {
        try {
            LocalDateTime start, end;
            if (inicio != null && fin != null) {
                start = LocalDateTime.parse(inicio + "T00:00:00");
                end = LocalDateTime.parse(fin + "T23:59:59");
            } else {
                start = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
                end = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
            }
            List<Map<String, Object>> productos = ventaService.obtenerProductosMasVendidos(start, end);
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    @GetMapping("/reportes/ultimas-ventas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> ultimasVentas(@RequestParam(defaultValue = "5") int limit) {
        try {
            List<Venta> ventas = ventaService.obtenerUltimasVentas(limit);
            List<Map<String, Object>> resultado = ventas.stream().map(v -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", v.getId());
                item.put("fecha", v.getFecha());
                item.put("total", v.getTotal());
                item.put("usuario", v.getUsuario() != null ? v.getUsuario().getUsername() : "Usuario desconocido");
                return item;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    @GetMapping("/reportes/ventas-por-dia")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> ventasPorUltimos7Dias() {
        try {
            List<Map<String, Object>> resultado = new ArrayList<>();
            for (int i = 6; i >= 0; i--) {
                LocalDate fecha = LocalDate.now().minusDays(i);
                LocalDateTime start = fecha.atStartOfDay();
                LocalDateTime end = fecha.atTime(23, 59, 59);
                Double total = ventaService.obtenerVentasPorFecha(start, end)
                        .stream().mapToDouble(Venta::getTotal).sum();
                Map<String, Object> dia = new HashMap<>();
                dia.put("fecha", fecha.toString());
                dia.put("total", total);
                resultado.add(dia);
            }
            return ResponseEntity.ok(Map.of("ventasPorDia", resultado));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}