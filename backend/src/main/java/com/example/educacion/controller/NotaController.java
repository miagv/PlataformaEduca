package com.example.educacion.controller;

import com.example.educacion.entity.Nota;
import com.example.educacion.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @GetMapping
    public ResponseEntity<List<Nota>> listar(){
        return ResponseEntity.ok(notaService.listar());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<Nota> guardar(@RequestBody Nota nota){
        return ResponseEntity.ok(notaService.guardar(nota));
    }

    @GetMapping("/estudiante/{id}")
    public ResponseEntity<List<Nota>> listarPorEstudiante(@PathVariable Long id){
        return ResponseEntity.ok(notaService.listarPorEstudiante(id));
    }

    @GetMapping("/mis-notas")
    public ResponseEntity<List<Nota>> listarMisNotas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(notaService.listarMisNotas(email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Nota> editar(@PathVariable Long id, @RequestBody Nota nota) {
        Nota actualizada = notaService.actualizar(id, nota);
        if (actualizada == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        notaService.eliminar(id);
        return ResponseEntity.ok("Nota eliminada");
    }
}