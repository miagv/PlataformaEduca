package com.example.educacion.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "cursos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String descripcion;

    private Integer creditos;

    private Boolean estado = true;

    @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Evaluacion> evaluaciones;

    @ManyToMany
    @JoinTable(
        name = "asignaciones_docentes",
        joinColumns = @JoinColumn(name = "curso_id"),
        inverseJoinColumns = @JoinColumn(name = "docente_id")
    )
    @JsonIgnore
    private List<Docente> docentes;
}