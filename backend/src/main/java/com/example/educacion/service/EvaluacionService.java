package com.example.educacion.service;

import com.example.educacion.entity.Evaluacion;
import com.example.educacion.repository.EvaluacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EvaluacionService {

    @Autowired
    private EvaluacionRepository evaluacionRepository;

    public List<Evaluacion> listar() {
        return evaluacionRepository.findAll();
    }

    public Evaluacion guardar(Evaluacion evaluacion) {
        return evaluacionRepository.save(evaluacion);
    }

    public Evaluacion buscar(Long id) {
        return evaluacionRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        Evaluacion evaluacion = buscar(id);
        if (evaluacion != null) {
            evaluacionRepository.delete(evaluacion);
        }
    }
}
