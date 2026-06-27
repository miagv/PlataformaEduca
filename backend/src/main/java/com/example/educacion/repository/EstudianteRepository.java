package com.example.educacion.repository;

import com.example.educacion.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    List<Estudiante> findBySalonId(Long salonId);
    List<Estudiante> findBySalonIsNull();
    Optional<Estudiante> findByUsuarioId(Long usuarioId);
}
