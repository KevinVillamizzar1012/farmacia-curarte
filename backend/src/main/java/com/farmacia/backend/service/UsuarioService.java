package com.farmacia.backend.service;

import com.farmacia.backend.dto.UsuarioDTO;
import com.farmacia.backend.dto.UsuarioRequestDTO;
import com.farmacia.backend.entity.Usuario;
import com.farmacia.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener usuario autenticado
    public Usuario getUsuarioActual() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Perfil del usuario autenticado
    public UsuarioDTO obtenerPerfil() {
        return convertirADTO(getUsuarioActual());
    }

    // Actualizar perfil (solo campos editables)
    public UsuarioDTO actualizarPerfil(UsuarioRequestDTO request) {
        Usuario usuario = getUsuarioActual();
        if (request.getNombre() != null) usuario.setNombre(request.getNombre());
        if (request.getApellido() != null) usuario.setApellido(request.getApellido());
        if (request.getEmail() != null) usuario.setEmail(request.getEmail());
        if (request.getTelefono() != null) usuario.setTelefono(request.getTelefono());
        if (request.getCodigoArea() != null) usuario.setCodigoArea(request.getCodigoArea());
        if (request.getFechaNacimiento() != null) usuario.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        // Nota: username y rol NO se actualizan aquí
        return convertirADTO(usuarioRepository.save(usuario));
    }

    // Subir avatar
    public void actualizarAvatar(MultipartFile file) throws IOException {
        Usuario usuario = getUsuarioActual();
        usuario.setAvatar(file.getBytes());
        usuarioRepository.save(usuario);
    }

    // Obtener avatar (bytes) de cualquier usuario por ID
    public byte[] obtenerAvatar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return usuario.getAvatar();
    }

    // Métodos CRUD (ya existentes)
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO obtenerUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertirADTO(usuario);
    }

    public UsuarioDTO crearUsuario(UsuarioRequestDTO request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya existe");
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
        usuario.setRol(request.getRol());
        return convertirADTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO actualizarUsuario(Long id, UsuarioRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setUsername(request.getUsername());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        usuario.setEmail(request.getEmail());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setCodigoArea(request.getCodigoArea());
        usuario.setTelefono(request.getTelefono());
        usuario.setRol(request.getRol());
        return convertirADTO(usuarioRepository.save(usuario));
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO convertirADTO(Usuario usuario) {
        String avatarBase64 = null;
        if (usuario.getAvatar() != null) {
            avatarBase64 = Base64.getEncoder().encodeToString(usuario.getAvatar());
        }
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getTelefono(),
                usuario.getCodigoArea(),
                usuario.getFechaNacimiento(),
                avatarBase64
        );
    }
}