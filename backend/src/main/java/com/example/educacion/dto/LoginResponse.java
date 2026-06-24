package com.example.educacion.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private Long usuarioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String rol;
}
