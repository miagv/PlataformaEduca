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
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuariORepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CargaHorariaRepository cargaHorariaRepository;

    public Curso guardar(Curso curso){
        return cursoRepository.save(curso);
    }

    public List<Curso> listar(){
        return cursoRepository.findAll();
    }

    public List<Curso> listarMisCursos(String email) {
        Usuario usuario = usuariORepository.findByEmail(email).orElse(null);
        if (usuario == null) return List.of();
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return List.of();
        return cargaHorariaRepository.findByDocenteId(docente.getId())
                .stream()
                .map(CargaHoraria::getCurso)
                .distinct()
                .collect(Collectors.toList());
    }

    public Curso buscar(Long id){
        return cursoRepository.findById(id).orElseThrow();
    }

    public void eliminar(Long id){
        Curso curso = buscar(id);
        
        curso.getDocentes().clear();
        cursoRepository.save(curso);
        
        cursoRepository.delete(curso);
    }
}