package com.farmacia.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank(message = "Username es obligatorio")
    private String username;

    @NotBlank(message = "Password es obligatorio")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}