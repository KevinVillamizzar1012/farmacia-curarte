package com.farmacia.backend.service;

import com.farmacia.backend.dto.RegistroRequest;
import com.farmacia.backend.entity.Usuario;
import com.farmacia.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registrarUsuario(RegistroRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEmail(request.getEmail());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setCodigoArea(request.getCodigoArea());
        usuario.setTelefono(request.getTelefono());
        usuario.setRol("CLIENTE");

        usuarioRepository.save(usuario);
    }
}