package com.farmacia.backend.service;

import com.farmacia.backend.entity.Banner;
import com.farmacia.backend.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class BannerService {

    @Autowired
    private BannerRepository bannerRepository;

    private final String UPLOAD_DIR = "uploads/banners/";

    // Subir un nuevo banner
    public Banner subirBanner(MultipartFile file, Integer orden) throws IOException {
        // Crear directorio si no existe
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generar nombre único
        String nombreArchivo = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(nombreArchivo);
        Files.write(filePath, file.getBytes());

        String url = "/uploads/banners/" + nombreArchivo;
        Banner banner = new Banner(url, orden, true);
        return bannerRepository.save(banner);
    }

    // Listar banners activos (ordenados)
    public List<Banner> listarBannersActivos() {
        return bannerRepository.findByActivoTrueOrderByOrdenAsc();
    }

    // Listar todos (para administración)
    public List<Banner> listarTodos() {
        return bannerRepository.findAll();
    }

    // Actualizar orden de un banner
    public Banner actualizarOrden(Long id, Integer nuevoOrden) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner no encontrado"));
        banner.setOrden(nuevoOrden);
        return bannerRepository.save(banner);
    }

    // Actualizar estado activo/inactivo
    public Banner actualizarEstado(Long id, Boolean activo) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner no encontrado"));
        banner.setActivo(activo);
        return bannerRepository.save(banner);
    }

    // Eliminar banner (físico + BD)
    public void eliminarBanner(Long id) throws IOException {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner no encontrado"));
        
        // Eliminar archivo físico
        String urlRelativa = banner.getUrl().replace("/uploads/banners/", "");
        Path filePath = Paths.get(UPLOAD_DIR + urlRelativa);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        bannerRepository.delete(banner);
    }
}