package com.example.educacion.service;

import com.example.educacion.entity.*;
import com.example.educacion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluacionService {

    @Autowired
    private EvaluacionRepository evaluacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CargaHorariaRepository cargaHorariaRepository;

    public List<Evaluacion> listar() {
        return evaluacionRepository.findAll();
    }

    public List<Evaluacion> listarPorCursos(List<Long> cursoIds) {
        if (cursoIds == null || cursoIds.isEmpty()) return List.of();
        return evaluacionRepository.findByCursoIdIn(cursoIds);
    }

    public List<Evaluacion> listarMisEvaluaciones(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) return List.of();
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return List.of();
        List<Long> cursoIds = cargaHorariaRepository.findByDocenteId(docente.getId())
                .stream()
                .map(ch -> ch.getCurso().getId())
                .distinct()
                .collect(Collectors.toList());
        if (cursoIds.isEmpty()) return List.of();
        return evaluacionRepository.findByCursoIdIn(cursoIds);
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
