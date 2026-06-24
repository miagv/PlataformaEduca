package com.example.educacion.controller;

import com.example.educacion.dto.LoginRequest;
import com.example.educacion.dto.RegisterRequest;
import com.example.educacion.entity.Usuario;
import com.example.educacion.security.JwtUtil;
import com.example.educacion.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = jwtUtil.generarToken(request.getEmail());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Sesión cerrada exitosamente");
    }
}