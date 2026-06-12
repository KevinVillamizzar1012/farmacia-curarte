package com.farmacia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class RegistroRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 2, max = 100)
    private String nombre;

    @NotBlank
    @Size(min = 2, max = 100)
    private String apellido;

    @NotBlank
    @Size(min = 4, max = 100)
    private String password;

    @Email
    private String email;

    @Past
    private LocalDate fechaNacimiento;

    @Pattern(regexp = "^\\+?[0-9]{1,3}$")
    private String codigoArea;

    @Pattern(regexp = "^[0-9]{7,15}$")
    private String telefono;

    private String nombreCompleto; // opcional, mantener por compatibilidad
    private String rol; // se ignorará

    // Getters y setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getCodigoArea() { return codigoArea; }
    public void setCodigoArea(String codigoArea) { this.codigoArea = codigoArea; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}