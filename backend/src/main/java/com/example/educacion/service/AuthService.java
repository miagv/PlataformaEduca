package com.example.educacion.service;

import com.example.educacion.dto.RegisterRequest;
import com.example.educacion.entity.Docente;
import com.example.educacion.entity.Estudiante;
import com.example.educacion.entity.Rol;
import com.example.educacion.entity.Usuario;
import com.example.educacion.repository.DocenteRepository;
import com.example.educacion.repository.EstudianteRepository;
import com.example.educacion.repository.RolRepository;
import com.example.educacion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario registrar(RegisterRequest request){

        Usuario usuario = new Usuario();

        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + request.getRol()));

        Set<Rol> roles = new HashSet<>();
        roles.add(rol);

        usuario.setRoles(roles);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        if ("ESTUDIANTE".equals(request.getRol())) {
            Estudiante estudiante = new Estudiante();
            estudiante.setUsuario(usuarioGuardado);
            estudiante.setCodigo("EST-" + usuarioGuardado.getId());
            estudiante.setGrado(request.getGrado());
            estudianteRepository.save(estudiante);
        } else if ("DOCENTE".equals(request.getRol())) {
            Docente docente = new Docente();
            docente.setUsuario(usuarioGuardado);
            docenteRepository.save(docente);
        }

        return usuarioGuardado;
    }
}
