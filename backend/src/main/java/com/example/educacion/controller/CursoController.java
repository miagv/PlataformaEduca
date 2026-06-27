package com.example.educacion.controller;

import com.example.educacion.entity.Curso;
import com.example.educacion.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<Curso>> listar(){
        return ResponseEntity.ok(cursoService.listar());
    }

    @GetMapping("/mis-cursos")
    public ResponseEntity<List<Curso>> listarMisCursos() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cursoService.listarMisCursos(email));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Curso> guardar(@RequestBody Curso curso){
        return ResponseEntity.ok(cursoService.guardar(curso));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Curso> editar(@PathVariable Long id,
                                        @RequestBody Curso curso){

        Curso cursoDB = cursoService.buscar(id);

        cursoDB.setNombre(curso.getNombre());
        cursoDB.setDescripcion(curso.getDescripcion());
        cursoDB.setCreditos(curso.getCreditos());

        return ResponseEntity.ok(cursoService.guardar(cursoDB));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminar(@PathVariable Long id){

        cursoService.eliminar(id);

        return ResponseEntity.ok("Curso eliminado");
    }
}
