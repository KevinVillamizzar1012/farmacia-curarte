package com.farmacia.backend.controller;

import com.farmacia.backend.repository.DetalleVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @GetMapping("/productos-mas-vendidos")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public List<Object[]> productosMasVendidos() {
        return detalleVentaRepository.findProductosMasVendidos();
    }
}