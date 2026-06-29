package com.example.educacion.repository;

import com.example.educacion.entity.SolicitudNota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudNotaRepository extends JpaRepository<SolicitudNota, Long> {
    List<SolicitudNota> findByDocenteIdOrderByCreadoEnDesc(Long docenteId);
    List<SolicitudNota> findByEstadoOrderByCreadoEnDesc(String estado);
    List<SolicitudNota> findAllByOrderByCreadoEnDesc();
    boolean existsByNotaIdAndEstado(Long notaId, String estado);
}