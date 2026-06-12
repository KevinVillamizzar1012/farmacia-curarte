package com.farmacia.backend.service;

import com.farmacia.backend.entity.Producto;
import com.farmacia.backend.entity.ProductoImagen;
import com.farmacia.backend.repository.ProductoImagenRepository;
import com.farmacia.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductoImagenService {

    @Autowired
    private ProductoImagenRepository productoImagenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    private final String UPLOAD_DIR = "uploads/productos/";

    public List<ProductoImagen> subirImagenes(Long productoId, MultipartFile[] files) throws IOException {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Crear directorio si no existe
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<ProductoImagen> imagenesGuardadas = new ArrayList<>();
        int ordenActual = producto.getImagenes().size();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                // Generar nombre único
                String nombreArchivo = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(nombreArchivo);
                Files.write(filePath, file.getBytes());

                // Crear entidad
                String url = "/uploads/productos/" + nombreArchivo;
                ProductoImagen imagen = new ProductoImagen(url, ordenActual++, producto);
                imagenesGuardadas.add(productoImagenRepository.save(imagen));
            }
        }

        return imagenesGuardadas;
    }

    public void eliminarImagen(Long imagenId) throws IOException {
        ProductoImagen imagen = productoImagenRepository.findById(imagenId)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));

        // Eliminar archivo físico
        String urlRelativa = imagen.getUrl().replace("/uploads/productos/", "");
        Path filePath = Paths.get(UPLOAD_DIR + urlRelativa);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        productoImagenRepository.delete(imagen);
    }

    public List<ProductoImagen> getImagenesByProducto(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return producto.getImagenes();
    }
}