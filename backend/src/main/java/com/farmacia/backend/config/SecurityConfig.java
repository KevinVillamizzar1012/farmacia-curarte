package com.farmacia.backend.config;

import com.farmacia.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas (sin token)
                .requestMatchers("/api/auth/**",
                                 "/api/productos/consultar/**",
                                 "/api/productos/codigo/**",
                                 "/api/usuarios/*/avatar",
                                 "/api/productos/*/imagenes",
                                 "/api/productos/imagenes/**",
                                 "/uploads/**").permitAll()
                // Endpoint público específico para obtener banners activos (GET)
                .requestMatchers(HttpMethod.GET, "/api/banners/activos").permitAll()
                // Endpoints de banners protegidos (solo ADMIN)
                .requestMatchers(HttpMethod.POST, "/api/banners").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/banners").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/banners/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/banners/**").hasRole("ADMIN")
                // Rutas con roles específicos
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/empleado/**").hasAnyRole("EMPLEADO", "ADMIN")
                .requestMatchers("/api/inventario/movimientos/**").hasAnyRole("ADMIN", "EMPLEADO")
                // Cualquier otra ruta requiere autenticación
                .anyRequest().authenticated()
            );
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}