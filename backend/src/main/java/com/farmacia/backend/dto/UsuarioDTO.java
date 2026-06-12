package com.farmacia.backend.dto;

import java.time.LocalDate;

public class UsuarioDTO {
    private Long id;
    private String username;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private String telefono;
    private String codigoArea;
    private LocalDate fechaNacimiento;
    private String avatarBase64;  // Para enviar la imagen codificada en Base64

    public UsuarioDTO() {}

    public UsuarioDTO(Long id, String username, String nombre, String apellido, 
                      String email, String rol, String telefono, String codigoArea, 
                      LocalDate fechaNacimiento, String avatarBase64) {
        this.id = id;
        this.username = username;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
        this.telefono = telefono;
        this.codigoArea = codigoArea;
        this.fechaNacimiento = fechaNacimiento;
        this.avatarBase64 = avatarBase64;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCodigoArea() { return codigoArea; }
    public void setCodigoArea(String codigoArea) { this.codigoArea = codigoArea; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getAvatarBase64() { return avatarBase64; }
    public void setAvatarBase64(String avatarBase64) { this.avatarBase64 = avatarBase64; }
}