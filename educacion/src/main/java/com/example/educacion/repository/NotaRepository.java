package com.example.educacion.repository;

import com.example.educacion.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    @Query("SELECT n FROM Nota n WHERE n.estudiante.id = :id")
    List<Nota> buscarPorEstudiante(Long id);
}
