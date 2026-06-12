package com.farmacia.backend.controller;

import com.farmacia.backend.dto.AuthRequest;
import com.farmacia.backend.dto.AuthResponse;
import com.farmacia.backend.dto.RegistroRequest;
import com.farmacia.backend.entity.Usuario;
import com.farmacia.backend.repository.UsuarioRepository;
import com.farmacia.backend.security.JwtUtil;
import com.farmacia.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Extraer el rol (sin prefijo ROLE_)
        String rol = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.replace("ROLE_", ""))
                .findFirst()
                .orElse("CLIENTE");
        
        // Generar token usando el método que recibe UserDetails
        String token = jwtUtil.generateToken(userDetails);
        
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setRol(rol);
        response.setUsername(userDetails.getUsername());
        response.setId(usuario.getId());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {
        authService.registrarUsuario(request);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado exitosamente"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token header"));
        }
        String oldToken = authHeader.substring(7);
        try {
            String username = jwtUtil.extractUsername(oldToken);
            // Necesitamos un UserDetails para regenerar el token. Podemos cargarlo desde el servicio.
            // Por simplicidad, si tu JwtUtil no tiene generateToken(String), no podemos hacer refresh fácil.
            // Mejor desactivamos refresh o lo implementamos con UserDetailsService.
            return ResponseEntity.status(501).body(Map.of("error", "Refresh no implementado temporalmente"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
}