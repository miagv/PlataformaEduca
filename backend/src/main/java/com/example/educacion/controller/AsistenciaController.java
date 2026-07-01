package com.example.educacion.controller;

import com.example.educacion.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    @PostMapping
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<List<Map<String, Object>>> tomarAsistencia(@RequestBody Map<String, Object> body) {
        Long salonId = Long.valueOf(body.get("salonId").toString());
        LocalDate fecha = LocalDate.parse(body.get("fecha").toString());
        List<Map<String, Object>> asistencias = (List<Map<String, Object>>) body.get("asistencias");
        return ResponseEntity.ok(asistenciaService.tomarAsistencia(salonId, fecha, asistencias));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> listar(
            @RequestParam Long salonId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(asistenciaService.listarPorSalonYFecha(salonId, fecha));
    }

    @GetMapping("/estadisticas")
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> estadisticas(
            @RequestParam Long salonId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(asistenciaService.estadisticas(salonId, desde, hasta));
    }

    @GetMapping("/verificar")
    @PreAuthorize("hasAnyRole('DOCENTE', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> verificar(
            @RequestParam Long salonId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        boolean tomada = asistenciaService.verificarAsistenciaTomada(salonId, fecha);
        return ResponseEntity.ok(Map.of("tomada", tomada));
    }
}
