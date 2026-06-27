package com.example.educacion.service;

import com.example.educacion.entity.*;
import com.example.educacion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SalonService {

    @Autowired
    private SalonRepository salonRepository;

    @Autowired
    private CargaHorariaRepository cargaHorariaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private UsuarioRepository usuariORepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public List<Salon> listar() {
        return salonRepository.findAllByOrderByGradoAscSeccionAsc();
    }

    public Salon guardar(Salon salon) {
        return salonRepository.save(salon);
    }

    public Salon buscar(Long id) {
        return salonRepository.findById(id).orElse(null);
    }

    public List<Salon> listarMisSalones(String email) {
        Usuario usuario = usuariORepository.findByEmail(email).orElse(null);
        if (usuario == null) return List.of();
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return List.of();
        return cargaHorariaRepository.findByDocenteId(docente.getId())
                .stream()
                .map(CargaHoraria::getSalon)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Curso> obtenerCursosPorSalon(Long salonId) {
        return cargaHorariaRepository.findBySalonId(salonId)
                .stream()
                .map(CargaHoraria::getCurso)
                .distinct()
                .collect(Collectors.toList());
    }

    public void eliminar(Long id) {
        Salon salon = buscar(id);
        if (salon != null) {
            salonRepository.delete(salon);
        }
    }

    public List<Map<String, Object>> obtenerDocentesConHoras(Long salonId) {
        List<CargaHoraria> cargas = cargaHorariaRepository.findBySalonId(salonId);
        return cargas.stream().map(ch -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", ch.getId());
            map.put("horasSemanales", ch.getHorasSemanales());

            Map<String, Object> docente = new HashMap<>();
            docente.put("id", ch.getDocente().getId());
            docente.put("especialidad", ch.getDocente().getEspecialidad());
            docente.put("nombres", ch.getDocente().getUsuario().getNombres());
            docente.put("apellidos", ch.getDocente().getUsuario().getApellidos());
            docente.put("email", ch.getDocente().getUsuario().getEmail());
            map.put("docente", docente);

            Map<String, Object> curso = new HashMap<>();
            curso.put("id", ch.getCurso().getId());
            curso.put("nombre", ch.getCurso().getNombre());
            map.put("curso", curso);

            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> obtenerReporte(Long salonId) {
        Salon salon = buscar(salonId);
        if (salon == null) return null;

        List<Estudiante> estudiantes = estudianteRepository.findBySalonId(salonId);
        List<Map<String, Object>> docentes = obtenerDocentesConHoras(salonId);

        List<Nota> todasNotas = new ArrayList<>();
        for (Estudiante e : estudiantes) {
            todasNotas.addAll(notaRepository.buscarPorEstudiante(e.getId()));
        }

        double promedioGeneral = todasNotas.stream()
                .mapToDouble(Nota::getNota)
                .average()
                .orElse(0.0);

        long aprobados = todasNotas.stream().filter(n -> n.getNota() >= 11).count();
        long total = todasNotas.size();
        double porcentajeAprobados = total > 0 ? (aprobados * 100.0 / total) : 0.0;

        Map<String, Double> promedioPorCurso = new HashMap<>();
        Map<String, List<Nota>> notasPorCurso = todasNotas.stream()
                .collect(Collectors.groupingBy(n -> n.getEvaluacion().getCurso().getNombre()));
        for (Map.Entry<String, List<Nota>> entry : notasPorCurso.entrySet()) {
            promedioPorCurso.put(entry.getKey(),
                    entry.getValue().stream().mapToDouble(Nota::getNota).average().orElse(0.0));
        }

        Map<String, Long> distribucionNotas = new LinkedHashMap<>();
        distribucionNotas.put("0-05", todasNotas.stream().filter(n -> n.getNota() <= 5).count());
        distribucionNotas.put("06-10", todasNotas.stream().filter(n -> n.getNota() > 5 && n.getNota() <= 10).count());
        distribucionNotas.put("11-15", todasNotas.stream().filter(n -> n.getNota() > 10 && n.getNota() <= 15).count());
        distribucionNotas.put("16-20", todasNotas.stream().filter(n -> n.getNota() > 15).count());

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("salonId", salon.getId());
        reporte.put("salonNombre", salon.getNombre());
        reporte.put("grado", salon.getGrado());
        reporte.put("seccion", salon.getSeccion());
        reporte.put("totalEstudiantes", estudiantes.size());
        reporte.put("estudiantes", estudiantes.stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("codigo", e.getCodigo());
            m.put("nombres", e.getUsuario().getNombres());
            m.put("apellidos", e.getUsuario().getApellidos());
            m.put("email", e.getUsuario().getEmail());
            return m;
        }).collect(Collectors.toList()));
        reporte.put("docentes", docentes);
        reporte.put("promedioGeneral", Math.round(promedioGeneral * 100.0) / 100.0);
        reporte.put("porcentajeAprobados", Math.round(porcentajeAprobados * 100.0) / 100.0);
        reporte.put("totalNotas", total);
        reporte.put("promedioPorCurso", promedioPorCurso);
        reporte.put("distribucionNotas", distribucionNotas);
        return reporte;
    }
}
