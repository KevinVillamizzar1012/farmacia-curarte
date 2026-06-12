package com.farmacia.backend.controller;

import com.farmacia.backend.entity.ProductoImagen;
import com.farmacia.backend.service.ProductoImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProductoImagenController {

    @Autowired
    private ProductoImagenService productoImagenService;

    @PostMapping("/{productoId}/imagenes")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<?> subirImagenes(
            @PathVariable Long productoId,
            @RequestParam("files") MultipartFile[] files) {
        try {
            List<ProductoImagen> imagenes = productoImagenService.subirImagenes(productoId, files);
            return ResponseEntity.ok(imagenes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir imágenes: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/imagenes/{imagenId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLEADO')")
    public ResponseEntity<?> eliminarImagen(@PathVariable Long imagenId) {
        try {
            productoImagenService.eliminarImagen(imagenId);
            return ResponseEntity.ok("Imagen eliminada correctamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar archivo: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{productoId}/imagenes")
    public ResponseEntity<?> getImagenesByProducto(@PathVariable Long productoId) {
        try {
            List<ProductoImagen> imagenes = productoImagenService.getImagenesByProducto(productoId);
            return ResponseEntity.ok(imagenes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}