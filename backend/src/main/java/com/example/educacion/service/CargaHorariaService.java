package com.example.educacion.service;

import com.example.educacion.entity.CargaHoraria;
import com.example.educacion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CargaHorariaService {

    @Autowired
    private CargaHorariaRepository cargaHorariaRepository;

    public List<CargaHoraria> listar() {
        return cargaHorariaRepository.findAll();
    }

    public List<CargaHoraria> listarPorSalon(Long salonId) {
        return cargaHorariaRepository.findBySalonId(salonId);
    }

    public CargaHoraria guardar(CargaHoraria cargaHoraria) {
        return cargaHorariaRepository.save(cargaHoraria);
    }

    public CargaHoraria buscar(Long id) {
        return cargaHorariaRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        CargaHoraria ch = buscar(id);
        if (ch != null) {
            cargaHorariaRepository.delete(ch);
        }
    }
}
