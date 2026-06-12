package com.farmacia.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    private String nombre;
    private String apellido;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String rol;
    
    private String email;
    private LocalDate fechaNacimiento;
    private String telefono;
    private String codigoArea;
    
    // Nuevos campos para avatar
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] avatar;          // Almacena la imagen como BLOB
    
    private String avatarContentType;  // Tipo MIME (image/jpeg, image/png, etc.)
    
    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getCodigoArea() { return codigoArea; }
    public void setCodigoArea(String codigoArea) { this.codigoArea = codigoArea; }
    
    public byte[] getAvatar() { return avatar; }
    public void setAvatar(byte[] avatar) { this.avatar = avatar; }
    
    public String getAvatarContentType() { return avatarContentType; }
    public void setAvatarContentType(String avatarContentType) { this.avatarContentType = avatarContentType; }
}