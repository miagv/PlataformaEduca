package com.example.educacion.service;

import com.example.educacion.entity.Docente;
import com.example.educacion.repository.DocenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    public List<Docente> listar() {
        return docenteRepository.findAll();
    }

    public Docente guardar(Docente docente) {
        return docenteRepository.save(docente);
    }

    public Docente buscar(Long id) {
        return docenteRepository.findById(id).orElse(null);
    }

    public Docente actualizar(Long id, String especialidad, String nombres, String apellidos, String email) {
        Docente docente = buscar(id);
        if (docente != null) {
            if (especialidad != null) docente.setEspecialidad(especialidad);
            if (nombres != null) docente.getUsuario().setNombres(nombres);
            if (apellidos != null) docente.getUsuario().setApellidos(apellidos);
            if (email != null) docente.getUsuario().setEmail(email);
            return docenteRepository.save(docente);
        }
        return null;
    }

    public void eliminar(Long id) {
        Docente docente = buscar(id);
        if (docente != null) {
            docenteRepository.delete(docente);
        }
    }
}
