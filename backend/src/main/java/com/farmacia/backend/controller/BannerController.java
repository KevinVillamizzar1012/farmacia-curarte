package com.farmacia.backend.controller;

import com.farmacia.backend.entity.Banner;
import com.farmacia.backend.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    // Endpoint público: obtener banners activos (para carrusel)
    @GetMapping("/activos")
    public ResponseEntity<List<Banner>> getBannersActivos() {
        return ResponseEntity.ok(bannerService.listarBannersActivos());
    }

    // Endpoint para admin: listar todos los banners
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Banner>> listarTodos() {
        return ResponseEntity.ok(bannerService.listarTodos());
    }

    // Subir nuevo banner (solo ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> subirBanner(
            @RequestParam("file") MultipartFile file,
            @RequestParam("orden") Integer orden) {
        try {
            Banner banner = bannerService.subirBanner(file, orden);
            return ResponseEntity.ok(banner);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir banner: " + e.getMessage());
        }
    }

    // Actualizar orden (solo ADMIN)
    @PutMapping("/{id}/orden")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarOrden(@PathVariable Long id, @RequestParam Integer orden) {
        try {
            Banner banner = bannerService.actualizarOrden(id, orden);
            return ResponseEntity.ok(banner);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Actualizar estado (activo/inactivo)
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        try {
            Banner banner = bannerService.actualizarEstado(id, activo);
            return ResponseEntity.ok(banner);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Eliminar banner
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarBanner(@PathVariable Long id) {
        try {
            bannerService.eliminarBanner(id);
            return ResponseEntity.ok("Banner eliminado correctamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar archivo: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}