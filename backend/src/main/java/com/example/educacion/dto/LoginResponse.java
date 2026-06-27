package com.example.educacion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

    private String token;
    private Long usuarioId;
    private String nombres;
    private String apellidos;
    private String email;
    private String rol;
    private Long estudianteId;
}
