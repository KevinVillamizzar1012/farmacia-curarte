package com.farmacia.backend.dto;

public class AuthResponse {
    private String token;
    private String rol;
    private String username;
    private Long id;  // ← nuevo campo

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}