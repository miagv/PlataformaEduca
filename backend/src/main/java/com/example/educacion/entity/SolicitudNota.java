package com.example.educacion.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_notas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudNota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "nota_id")
    private Nota nota;

    @ManyToOne
    @JoinColumn(name = "docente_id")
    private Docente docente;

    private Double notaAnterior;

    private Double notaNueva;

    @Column(length = 500)
    private String motivo;

    @Column(length = 20)
    private String estado = "PENDIENTE";

    @Column(length = 500)
    private String motivoRechazo;

    private LocalDateTime creadoEn;

    private LocalDateTime respondidoEn;

    @PrePersist
    public void prePersist() {
        creadoEn = LocalDateTime.now();
    }
}