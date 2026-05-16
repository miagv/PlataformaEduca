package com.example.educacion.service;

import com.example.educacion.dto.RegisterRequest;
import com.example.educacion.entity.Rol;
import com.example.educacion.entity.Usuario;
import com.example.educacion.repository.RolRepository;
import com.example.educacion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrar(RegisterRequest request){

        Usuario usuario = new Usuario();

        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow();

        Set<Rol> roles = new HashSet<>();
        roles.add(rol);

        usuario.setRoles(roles);

        return usuarioRepository.save(usuario);
    }
}
