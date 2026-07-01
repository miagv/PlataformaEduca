package com.example.educacion.repository;

import com.example.educacion.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findBySalonIdAndFecha(Long salonId, LocalDate fecha);

    List<Asistencia> findBySalonIdAndFechaBetween(Long salonId, LocalDate desde, LocalDate hasta);

    List<Asistencia> findByEstudianteIdAndFechaBetween(Long estudianteId, LocalDate desde, LocalDate hasta);

    Long countBySalonIdAndFechaAndPresenteTrue(Long salonId, LocalDate fecha);

    Long countBySalonIdAndFecha(Long salonId, LocalDate fecha);

    Optional<Asistencia> findByEstudianteIdAndFecha(Long estudianteId, LocalDate fecha);

    void deleteBySalonIdAndFecha(Long salonId, LocalDate fecha);
}
