package com.example.educacion.service;

import com.example.educacion.entity.*;
import com.example.educacion.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SolicitudNotaService {

    @Autowired
    private SolicitudNotaRepository solicitudNotaRepository;

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private UsuarioRepository usuariORepository;

    @Autowired
    private DocenteRepository docenteRepository;

    public SolicitudNota crearSolicitud(String email, Long notaId, Double notaNueva, String motivo) {
        Usuario usuario = usuariORepository.findByEmail(email).orElse(null);
        if (usuario == null) return null;
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return null;

        Nota nota = notaRepository.findById(notaId).orElse(null);
        if (nota == null) return null;

        if (solicitudNotaRepository.existsByNotaIdAndEstado(notaId, "PENDIENTE")) {
            return null;
        }

        SolicitudNota solicitud = new SolicitudNota();
        solicitud.setNota(nota);
        solicitud.setDocente(docente);
        solicitud.setNotaAnterior(nota.getNota());
        solicitud.setNotaNueva(notaNueva);
        solicitud.setMotivo(motivo);
        solicitud.setEstado("PENDIENTE");
        return solicitudNotaRepository.save(solicitud);
    }

    public SolicitudNota aprobarSolicitud(Long solicitudId) {
        SolicitudNota solicitud = solicitudNotaRepository.findById(solicitudId).orElse(null);
        if (solicitud == null || !"PENDIENTE".equals(solicitud.getEstado())) return null;

        Nota nota = solicitud.getNota();
        nota.setNota(solicitud.getNotaNueva());
        notaRepository.save(nota);

        solicitud.setEstado("APROBADO");
        solicitud.setRespondidoEn(LocalDateTime.now());
        return solicitudNotaRepository.save(solicitud);
    }

    public SolicitudNota rechazarSolicitud(Long solicitudId, String motivoRechazo) {
        SolicitudNota solicitud = solicitudNotaRepository.findById(solicitudId).orElse(null);
        if (solicitud == null || !"PENDIENTE".equals(solicitud.getEstado())) return null;

        solicitud.setEstado("RECHAZADO");
        solicitud.setMotivoRechazo(motivoRechazo);
        solicitud.setRespondidoEn(LocalDateTime.now());
        return solicitudNotaRepository.save(solicitud);
    }

    public List<SolicitudNota> listarTodas() {
        return solicitudNotaRepository.findAllByOrderByCreadoEnDesc();
    }

    public List<SolicitudNota> listarPorDocente(String email) {
        Usuario usuario = usuariORepository.findByEmail(email).orElse(null);
        if (usuario == null) return List.of();
        Docente docente = docenteRepository.findByUsuarioId(usuario.getId()).orElse(null);
        if (docente == null) return List.of();
        return solicitudNotaRepository.findByDocenteIdOrderByCreadoEnDesc(docente.getId());
    }
}