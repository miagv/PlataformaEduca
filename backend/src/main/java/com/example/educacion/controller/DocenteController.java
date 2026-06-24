package com.example.educacion.controller;

import com.example.educacion.entity.Docente;
import com.example.educacion.service.DocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@CrossOrigin("*")
public class DocenteController {

    @Autowired
    private DocenteService docenteService;

    @GetMapping
    public ResponseEntity<List<Docente>> listar() {
        return ResponseEntity.ok(docenteService.listar());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Docente> guardar(@RequestBody Docente docente) {
        return ResponseEntity.ok(docenteService.guardar(docente));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Docente> editar(@PathVariable Long id, @RequestBody Docente docente) {
        Docente docenteDB = docenteService.buscar(id);
        if (docenteDB != null) {
            docenteDB.setEspecialidad(docente.getEspecialidad());
            return ResponseEntity.ok(docenteService.guardar(docenteDB));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        docenteService.eliminar(id);
        return ResponseEntity.ok("Docente eliminado");
    }
}
