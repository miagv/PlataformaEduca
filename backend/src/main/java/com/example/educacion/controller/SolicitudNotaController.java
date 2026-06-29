package com.example.educacion.controller;

import com.example.educacion.entity.SolicitudNota;
import com.example.educacion.service.SolicitudNotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes-notas")
public class SolicitudNotaController {

    @Autowired
    private SolicitudNotaService solicitudNotaService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listarTodas() {
        return ResponseEntity.ok(solicitudNotaService.listarTodas());
    }

    @GetMapping("/mis-solicitudes")
    public ResponseEntity<?> listarMisSolicitudes() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(solicitudNotaService.listarPorDocente(email));
    }

    @PostMapping
    public ResponseEntity<?> crearSolicitud(@RequestBody Map<String, Object> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long notaId = Long.valueOf(body.get("notaId").toString());
        Double notaNueva = Double.valueOf(body.get("notaNueva").toString());
        String motivo = (String) body.get("motivo");

        SolicitudNota solicitud = solicitudNotaService.crearSolicitud(email, notaId, notaNueva, motivo);
        if (solicitud == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No se pudo crear la solicitud. Verifique que la nota exista y no tenga una solicitud pendiente."));
        }
        return ResponseEntity.ok(solicitud);
    }

    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> aprobarSolicitud(@PathVariable Long id) {
        SolicitudNota solicitud = solicitudNotaService.aprobarSolicitud(id);
        if (solicitud == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No se pudo aprobar la solicitud."));
        }
        return ResponseEntity.ok(solicitud);
    }

    @PutMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rechazarSolicitud(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String motivoRechazo = (String) body.get("motivoRechazo");
        SolicitudNota solicitud = solicitudNotaService.rechazarSolicitud(id, motivoRechazo);
        if (solicitud == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No se pudo rechazar la solicitud."));
        }
        return ResponseEntity.ok(solicitud);
    }
}