package com.example.educacion.repository;

import com.example.educacion.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    @Query("SELECT e FROM Evaluacion e WHERE e.curso.id IN :cursoIds")
    List<Evaluacion> findByCursoIdIn(List<Long> cursoIds);
}
