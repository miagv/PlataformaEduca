package com.example.educacion.controller;

import com.example.educacion.entity.Estudiante;
import com.example.educacion.service.EstudianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin("*")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    public ResponseEntity<List<Estudiante>> listar() {
        return ResponseEntity.ok(estudianteService.listar());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Estudiante> guardar(@RequestBody Estudiante estudiante) {
        return ResponseEntity.ok(estudianteService.guardar(estudiante));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Estudiante> editar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        Estudiante estudianteDB = estudianteService.buscar(id);
        if (estudianteDB != null) {
            estudianteDB.setCodigo(estudiante.getCodigo());
            return ResponseEntity.ok(estudianteService.guardar(estudianteDB));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
        return ResponseEntity.ok("Estudiante eliminado");
    }
}
