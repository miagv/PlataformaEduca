package com.example.educacion.repository;

import com.example.educacion.entity.Salon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalonRepository extends JpaRepository<Salon, Long> {
    List<Salon> findAllByOrderByGradoAscSeccionAsc();
}
