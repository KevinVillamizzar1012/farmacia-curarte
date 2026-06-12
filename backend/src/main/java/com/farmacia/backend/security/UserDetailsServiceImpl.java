package com.farmacia.backend.security;

import com.farmacia.backend.entity.Usuario;
import com.farmacia.backend.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("Intento de login fallido: usuario '{}' no encontrado", username);
                    return new UsernameNotFoundException("Usuario no encontrado: " + username);
                });

        // Verificar el rol en la base de datos
        String rolBD = usuario.getRol();
        logger.info("Cargando usuario: {}, rol en BD: {}", usuario.getUsername(), rolBD);

        // Asegurar que el rol tiene el prefijo ROLE_ (Spring Security lo requiere)
        String authority = "ROLE_" + rolBD;
        logger.info("Autoridad asignada: {}", authority);

        return new User(usuario.getUsername(), usuario.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(authority)));
    }
}