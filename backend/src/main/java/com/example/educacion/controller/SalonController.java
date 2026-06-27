package com.example.educacion.controller;

import com.example.educacion.entity.Salon;
import com.example.educacion.entity.CargaHoraria;
import com.example.educacion.entity.Curso;
import com.example.educacion.entity.Docente;
import com.example.educacion.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salones")
public class SalonController {

    @Autowired
    private SalonService salonService;

    @Autowired
    private CargaHorariaService cargaHorariaService;

    @Autowired
    private DocenteService docenteService;

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<Salon>> listar() {
        return ResponseEntity.ok(salonService.listar());
    }

    @GetMapping("/mis-salones")
    public ResponseEntity<List<Salon>> listarMisSalones() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(salonService.listarMisSalones(email));
    }

    @GetMapping("/{id}/cursos")
    public ResponseEntity<List<Curso>> obtenerCursos(@PathVariable Long id) {
        return ResponseEntity.ok(salonService.obtenerCursosPorSalon(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salon> obtener(@PathVariable Long id) {
        Salon salon = salonService.buscar(id);
        if (salon == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(salon);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Salon> guardar(@RequestBody Salon salon) {
        return ResponseEntity.ok(salonService.guardar(salon));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Salon> editar(@PathVariable Long id, @RequestBody Salon salon) {
        Salon salonDB = salonService.buscar(id);
        if (salonDB == null) return ResponseEntity.notFound().build();
        salonDB.setGrado(salon.getGrado());
        salonDB.setSeccion(salon.getSeccion());
        salonDB.setActivo(salon.getActivo());
        return ResponseEntity.ok(salonService.guardar(salonDB));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        salonService.eliminar(id);
        return ResponseEntity.ok("Salon eliminado");
    }

    @GetMapping("/{id}/docentes")
    public ResponseEntity<List<Map<String, Object>>> obtenerDocentes(@PathVariable Long id) {
        return ResponseEntity.ok(salonService.obtenerDocentesConHoras(id));
    }

    @GetMapping("/{id}/reporte")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCENTE')")
    public ResponseEntity<Map<String, Object>> obtenerReporte(@PathVariable Long id) {
        Map<String, Object> reporte = salonService.obtenerReporte(id);
        if (reporte == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reporte);
    }

    @PostMapping("/{id}/carga-horaria")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> agregarCargaHoraria(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Salon salon = salonService.buscar(id);
        if (salon == null) return ResponseEntity.notFound().build();

        Docente docente = docenteService.buscar(Long.valueOf(body.get("docenteId").toString()));
        Curso curso = cursoService.buscar(Long.valueOf(body.get("cursoId").toString()));

        CargaHoraria ch = new CargaHoraria();
        ch.setSalon(salon);
        ch.setDocente(docente);
        ch.setCurso(curso);
        ch.setHorasSemanales(Integer.valueOf(body.get("horasSemanales").toString()));

        return ResponseEntity.ok(cargaHorariaService.guardar(ch));
    }

    @PutMapping("/carga-horaria/{chId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editarCargaHoraria(@PathVariable Long chId, @RequestBody Map<String, Object> body) {
        CargaHoraria ch = cargaHorariaService.buscar(chId);
        if (ch == null) return ResponseEntity.notFound().build();
        if (body.containsKey("horasSemanales"))
            ch.setHorasSemanales(Integer.valueOf(body.get("horasSemanales").toString()));
        if (body.containsKey("cursoId"))
            ch.setCurso(cursoService.buscar(Long.valueOf(body.get("cursoId").toString())));
        return ResponseEntity.ok(cargaHorariaService.guardar(ch));
    }

    @DeleteMapping("/carga-horaria/{chId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarCargaHoraria(@PathVariable Long chId) {
        cargaHorariaService.eliminar(chId);
        return ResponseEntity.ok("Carga horaria eliminada");
    }
}
