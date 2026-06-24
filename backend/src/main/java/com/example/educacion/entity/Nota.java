package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double nota;

    private String observacion;

    @ManyToOne
    @JoinColumn(name = "evaluacion_id")
    private Evaluacion evaluacion;

    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;
}
