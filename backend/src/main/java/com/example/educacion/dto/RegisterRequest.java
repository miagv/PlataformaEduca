package com.example.educacion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String nombres;
    private String apellidos;
    private String email;
    private String password;
    private String rol;
    private String grado;
}
