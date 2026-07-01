package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "asistencias", uniqueConstraints = @UniqueConstraint(columnNames = {"estudiante_id", "fecha"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "salon_id")
    private Salon salon;

    private LocalDate fecha;

    private Boolean presente;

    @Column(length = 200)
    private String observacion;
}
