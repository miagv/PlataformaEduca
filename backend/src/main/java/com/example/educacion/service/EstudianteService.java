package com.example.educacion.service;

import com.example.educacion.entity.Estudiante;
import com.example.educacion.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    public List<Estudiante> listar() {
        return estudianteRepository.findAll();
    }

    public List<Estudiante> listarPorSalon(Long salonId) {
        return estudianteRepository.findBySalonId(salonId);
    }

    public List<Estudiante> listarSinSalon() {
        return estudianteRepository.findBySalonIsNull();
    }

    public Estudiante guardar(Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    public Estudiante buscar(Long id) {
        return estudianteRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        Estudiante estudiante = buscar(id);
        if (estudiante != null) {
            estudianteRepository.delete(estudiante);
        }
    }
}
