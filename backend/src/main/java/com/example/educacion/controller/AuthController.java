package com.example.educacion.controller;

import com.example.educacion.dto.LoginRequest;
import com.example.educacion.dto.LoginResponse;
import com.example.educacion.dto.RegisterRequest;
import com.example.educacion.entity.Estudiante;
import com.example.educacion.entity.Usuario;
import com.example.educacion.repository.EstudianteRepository;
import com.example.educacion.repository.UsuarioRepository;
import com.example.educacion.security.JwtUtil;
import com.example.educacion.service.AuthService;
import com.example.educacion.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generarToken(request.getEmail());
        String rol = usuario.getRoles().stream()
                .findFirst()
                .map(r -> r.getNombre())
                .orElse("ESTUDIANTE");

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUsuarioId(usuario.getId());
        response.setNombres(usuario.getNombres());
        response.setApellidos(usuario.getApellidos());
        response.setEmail(usuario.getEmail());
        response.setRol(rol);

        if ("ESTUDIANTE".equals(rol)) {
            Estudiante estudiante = estudianteRepository.findByUsuarioId(usuario.getId()).orElse(null);
            if (estudiante != null) {
                response.setEstudianteId(estudiante.getId());
            }
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extraerUsername(token);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String rol = usuario.getRoles().stream()
                .findFirst()
                .map(r -> r.getNombre())
                .orElse("ESTUDIANTE");

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUsuarioId(usuario.getId());
        response.setNombres(usuario.getNombres());
        response.setApellidos(usuario.getApellidos());
        response.setEmail(usuario.getEmail());
        response.setRol(rol);

        if ("ESTUDIANTE".equals(rol)) {
            Estudiante estudiante = estudianteRepository.findByUsuarioId(usuario.getId()).orElse(null);
            if (estudiante != null) {
                response.setEstudianteId(estudiante.getId());
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Sesión cerrada exitosamente");
    }

    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok("Usuario eliminado");
    }

    @GetMapping("/coordinadores")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> listarCoordinadores() {
        return ResponseEntity.ok(usuarioRepository.findByRol("ADMIN"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El email es requerido"));
        }
        String token = passwordResetService.generarToken(email);
        if (token == null) {
            return ResponseEntity.ok(Map.of("mensaje", "Si el email existe, recibirás un código de recuperación"));
        }
        return ResponseEntity.ok(Map.of(
            "mensaje", "Código de recuperación enviado",
            "token", token,
            "nota", "En producción este código se enviaría por email"
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Token y nueva contraseña requeridos"));
        }
        boolean exito = passwordResetService.reestablecerPassword(token, newPassword);
        if (!exito) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Token inválido o expirado"));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida exitosamente"));
    }
}