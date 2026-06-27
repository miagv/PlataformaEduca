package com.example.educacion.controller;

import com.example.educacion.entity.Curso;
import com.example.educacion.entity.Evaluacion;
import com.example.educacion.service.CargaHorariaService;
import com.example.educacion.service.EvaluacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evaluaciones")
public class EvaluacionController {

    @Autowired
    private EvaluacionService evaluacionService;

    @Autowired
    private CargaHorariaService cargaHorariaService;

    @GetMapping
    public ResponseEntity<List<Evaluacion>> listar() {
        return ResponseEntity.ok(evaluacionService.listar());
    }

    @GetMapping("/mis-evaluaciones")
    public ResponseEntity<List<Evaluacion>> listarMisEvaluaciones() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(evaluacionService.listarMisEvaluaciones(email));
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Evaluacion>> listarPorSalon(@PathVariable Long salonId) {
        List<Long> cursoIds = cargaHorariaService.listarPorSalon(salonId)
                .stream()
                .map(ch -> ch.getCurso().getId())
                .distinct()
                .collect(Collectors.toList());
        return ResponseEntity.ok(evaluacionService.listarPorCursos(cursoIds));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<Evaluacion> guardar(@RequestBody Evaluacion evaluacion) {
        return ResponseEntity.ok(evaluacionService.guardar(evaluacion));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<Evaluacion> editar(@PathVariable Long id, @RequestBody Evaluacion evaluacion) {
        Evaluacion evaluacionDB = evaluacionService.buscar(id);
        if (evaluacionDB != null) {
            evaluacionDB.setTitulo(evaluacion.getTitulo());
            evaluacionDB.setPorcentaje(evaluacion.getPorcentaje());
            evaluacionDB.setFecha(evaluacion.getFecha());
            evaluacionDB.setCurso(evaluacion.getCurso());
            return ResponseEntity.ok(evaluacionService.guardar(evaluacionDB));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        evaluacionService.eliminar(id);
        return ResponseEntity.ok("Evaluación eliminada");
    }
}
