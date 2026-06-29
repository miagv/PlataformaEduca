package com.example.educacion.service;

import com.example.educacion.entity.*;
import com.example.educacion.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private UsuarioRepository usuariORepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CargaHorariaRepository cargaHorariaRepository;

    public Nota guardar(Nota nota){
        return notaRepository.save(nota);
    }

    public List<Nota> listar(){
        return notaRepository.findAll();
    }

    public Nota actualizar(Long id, Nota notaActualizada) {
        Nota nota = notaRepository.findById(id).orElse(null);
        if (nota == null) return null;
        if (notaActualizada.getNota() != null) nota.setNota(notaActualizada.getNota());
        if (notaActualizada.getObservacion() != null) nota.setObservacion(notaActualizada.getObservacion());
        if (notaActualizada.getEvaluacion() != null) nota.setEvaluacion(notaActualizada.getEvaluacion());
        if (notaActualizada.getEstudiante() != null) nota.setEstudiante(notaActualizada.getEstudiante());
        return notaRepository.save(nota);
    }

    public void eliminar(Long id) {
        notaRepository.findById(id).ifPresent(nota -> notaRepository.delete(nota));
    }

    public List<Nota> listarPorEstudiante(Long id){
        return notaRepository.buscarPorEstudiante(id);
    }

    public List<Nota> listarMisNotas(String email) {
        Usuario usuario = usuariORepository.findByEmail(email).orElse(null);
        if (usuario == null) return List.of();
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return List.of();
        List<Long> cursoIds = cargaHorariaRepository.findByDocenteId(docente.getId())
                .stream()
                .map(ch -> ch.getCurso().getId())
                .distinct()
                .collect(Collectors.toList());
        if (cursoIds.isEmpty()) return List.of();
        return notaRepository.findByEvaluacionCursoIdIn(cursoIds);
    }
}