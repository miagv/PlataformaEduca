package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Salon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String grado;

    private String seccion;

    private Boolean activo = true;

    public String getNombre() {
        return grado + " \"" + seccion + "\"";
    }
}
