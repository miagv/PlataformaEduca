package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "evaluaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private Double porcentaje;

    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;
}
