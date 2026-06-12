package com.farmacia.backend.controller;

import com.farmacia.backend.dto.UsuarioDTO;
import com.farmacia.backend.dto.UsuarioRequestDTO;
import com.farmacia.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO> obtenerPerfil() {
        return ResponseEntity.ok(usuarioService.obtenerPerfil());
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioDTO> actualizarPerfil(@RequestBody UsuarioRequestDTO request) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(request));
    }

    @PostMapping(value = "/perfil/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> actualizarAvatar(@RequestParam("avatar") MultipartFile file) {
        try {
            usuarioService.actualizarAvatar(file);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Avatar actualizado correctamente");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al procesar la imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<byte[]> obtenerAvatar(@PathVariable Long id) {
        byte[] avatar = usuarioService.obtenerAvatar(id);
        if (avatar == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(avatar);
    }
}