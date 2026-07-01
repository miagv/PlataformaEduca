package com.example.educacion.service;

import com.example.educacion.entity.Asistencia;
import com.example.educacion.entity.Estudiante;
import com.example.educacion.entity.Salon;
import com.example.educacion.repository.AsistenciaRepository;
import com.example.educacion.repository.EstudianteRepository;
import com.example.educacion.repository.SalonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private SalonRepository salonRepository;

    public List<Map<String, Object>> tomarAsistencia(Long salonId, LocalDate fecha, List<Map<String, Object>> asistencias) {
        asistenciaRepository.deleteBySalonIdAndFecha(salonId, fecha);

        Salon salon = salonRepository.findById(salonId).orElse(null);
        if (salon == null) return List.of();

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Map<String, Object> item : asistencias) {
            Long estudianteId = Long.valueOf(item.get("estudianteId").toString());
            Boolean presente = Boolean.valueOf(item.get("presente").toString());
            String observacion = (String) item.getOrDefault("observacion", "");

            Estudiante estudiante = estudianteRepository.findById(estudianteId).orElse(null);
            if (estudiante == null) continue;

            Asistencia a = new Asistencia();
            a.setEstudiante(estudiante);
            a.setSalon(salon);
            a.setFecha(fecha);
            a.setPresente(presente);
            a.setObservacion(observacion);

            Asistencia guardada = asistenciaRepository.save(a);

            Map<String, Object> map = new HashMap<>();
            map.put("id", guardada.getId());
            map.put("estudianteId", estudianteId);
            map.put("presente", presente);
            map.put("observacion", observacion);
            resultado.add(map);
        }
        return resultado;
    }

    public List<Map<String, Object>> listarPorSalonYFecha(Long salonId, LocalDate fecha) {
        List<Asistencia> lista = asistenciaRepository.findBySalonIdAndFecha(salonId, fecha);
        Set<Long> idsConAsistencia = lista.stream()
                .map(a -> a.getEstudiante().getId())
                .collect(Collectors.toSet());

        List<Estudiante> estudiantes = estudianteRepository.findBySalonId(salonId);

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Estudiante e : estudiantes) {
            Map<String, Object> item = new HashMap<>();
            item.put("estudianteId", e.getId());
            item.put("codigo", e.getCodigo());
            item.put("nombres", e.getUsuario().getNombres());
            item.put("apellidos", e.getUsuario().getApellidos());

            if (idsConAsistencia.contains(e.getId())) {
                Asistencia a = lista.stream()
                        .filter(as -> as.getEstudiante().getId().equals(e.getId()))
                        .findFirst().orElse(null);
                if (a != null) {
                    item.put("asistenciaId", a.getId());
                    item.put("presente", a.getPresente());
                    item.put("observacion", a.getObservacion());
                }
            } else {
                item.put("asistenciaId", null);
                item.put("presente", null);
                item.put("observacion", null);
            }
            resultado.add(item);
        }
        return resultado;
    }

    public Map<String, Object> estadisticas(Long salonId, LocalDate desde, LocalDate hasta) {
        List<Asistencia> lista = asistenciaRepository.findBySalonIdAndFechaBetween(salonId, desde, hasta);
        long total = lista.size();
        long presentes = lista.stream().filter(Asistencia::getPresente).count();
        long ausentes = total - presentes;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRegistros", total);
        stats.put("presentes", presentes);
        stats.put("ausentes", ausentes);
        stats.put("porcentajeAsistencia", total > 0 ? Math.round((presentes * 100.0 / total) * 100.0) / 100.0 : 0);

        Map<LocalDate, Long> asistenciasPorFecha = lista.stream()
                .filter(Asistencia::getPresente)
                .collect(Collectors.groupingBy(Asistencia::getFecha, Collectors.counting()));
        stats.put("asistenciasPorFecha", asistenciasPorFecha);

        return stats;
    }

    public boolean verificarAsistenciaTomada(Long salonId, LocalDate fecha) {
        return !asistenciaRepository.findBySalonIdAndFecha(salonId, fecha).isEmpty();
    }
}
