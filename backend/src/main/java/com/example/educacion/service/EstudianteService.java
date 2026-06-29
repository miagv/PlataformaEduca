package com.example.educacion.service;

import com.example.educacion.entity.*;
import com.example.educacion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private UsuarioRepository usuariORepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CargaHorariaRepository cargaHorariaRepository;

    public List<Estudiante> listar() {
        return estudianteRepository.findAll();
    }

    public List<Estudiante> listarPorSalon(Long salonId) {
        return estudianteRepository.findBySalonId(salonId);
    }

    public List<Estudiante> listarSinSalon() {
        return estudianteRepository.findBySalonIsNull();
    }

    public List<Estudiante> listarMisEstudiantes(String email) {
        Usuario usuario = usuariORepository.findByEmail(email).orElse(null);
        if (usuario == null) return List.of();
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return List.of();
        List<Long> salonIds = cargaHorariaRepository.findByDocenteId(docente.getId())
                .stream()
                .map(ch -> ch.getSalon().getId())
                .distinct()
                .collect(Collectors.toList());
        if (salonIds.isEmpty()) return List.of();
        return estudianteRepository.findBySalonIdIn(salonIds);
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
