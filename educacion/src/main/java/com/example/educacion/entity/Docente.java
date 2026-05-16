package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "docentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String especialidad;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}