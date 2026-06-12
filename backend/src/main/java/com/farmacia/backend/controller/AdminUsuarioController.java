package com.farmacia.backend.controller;

import com.farmacia.backend.dto.UsuarioDTO;
import com.farmacia.backend.dto.UsuarioRequestDTO;
import com.farmacia.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerUsuario(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@Valid @RequestBody UsuarioRequestDTO request) {
        return ResponseEntity.ok(usuarioService.crearUsuario(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDTO request) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}