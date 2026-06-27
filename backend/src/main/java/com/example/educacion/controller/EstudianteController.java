package com.example.educacion.controller;

import com.example.educacion.entity.Estudiante;
import com.example.educacion.entity.Salon;
import com.example.educacion.service.EstudianteService;
import com.example.educacion.service.SalonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @Autowired
    private SalonService salonService;

    @GetMapping
    public ResponseEntity<List<Estudiante>> listar() {
        return ResponseEntity.ok(estudianteService.listar());
    }

    @GetMapping("/sin-salon")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCENTE')")
    public ResponseEntity<List<Estudiante>> listarSinSalon() {
        return ResponseEntity.ok(estudianteService.listarSinSalon());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> obtener(@PathVariable Long id) {
        Estudiante estudiante = estudianteService.buscar(id);
        if (estudiante == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(estudiante);
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Estudiante>> listarPorSalon(@PathVariable Long salonId) {
        return ResponseEntity.ok(estudianteService.listarPorSalon(salonId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCENTE')")
    public ResponseEntity<Estudiante> guardar(@RequestBody Estudiante estudiante) {
        return ResponseEntity.ok(estudianteService.guardar(estudiante));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCENTE')")
    public ResponseEntity<Estudiante> editar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        Estudiante estudianteDB = estudianteService.buscar(id);
        if (estudianteDB != null) {
            if (estudiante.getCodigo() != null) estudianteDB.setCodigo(estudiante.getCodigo());
            if (estudiante.getSalon() != null) estudianteDB.setSalon(estudiante.getSalon());
            return ResponseEntity.ok(estudianteService.guardar(estudianteDB));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/asignar-salon")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCENTE')")
    public ResponseEntity<?> asignarSalon(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Estudiante estudianteDB = estudianteService.buscar(id);
        if (estudianteDB == null) return ResponseEntity.notFound().build();
        Long salonId = Long.valueOf(body.get("salonId").toString());
        Salon salon = salonService.buscar(salonId);
        if (salon == null) return ResponseEntity.badRequest().body(Map.of("mensaje", "Salon no encontrado"));
        estudianteDB.setSalon(salon);
        return ResponseEntity.ok(estudianteService.guardar(estudianteDB));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCENTE')")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
        return ResponseEntity.ok("Estudiante eliminado");
    }
}
