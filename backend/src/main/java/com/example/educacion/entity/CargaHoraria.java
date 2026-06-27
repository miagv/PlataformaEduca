package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carga_horaria",
       uniqueConstraints = @UniqueConstraint(columnNames = {"docente_id", "salon_id", "curso_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CargaHoraria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "docente_id")
    private Docente docente;

    @ManyToOne
    @JoinColumn(name = "salon_id")
    private Salon salon;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    private Integer horasSemanales;
}
