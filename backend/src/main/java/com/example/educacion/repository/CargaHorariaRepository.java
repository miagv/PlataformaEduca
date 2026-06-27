package com.example.educacion.repository;

import com.example.educacion.entity.CargaHoraria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CargaHorariaRepository extends JpaRepository<CargaHoraria, Long> {
    List<CargaHoraria> findBySalonId(Long salonId);
    List<CargaHoraria> findByDocenteId(Long docenteId);
    List<CargaHoraria> findBySalonIdAndDocenteId(Long salonId, Long docenteId);
}
