package com.example.educacion.service;

import com.example.educacion.entity.PasswordResetToken;
import com.example.educacion.entity.Usuario;
import com.example.educacion.repository.PasswordResetTokenRepository;
import com.example.educacion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String generarToken(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElse(null);
        if (usuario == null) {
            return null;
        }

        SecureRandom random = new SecureRandom();
        int tokenNum = 100000 + random.nextInt(900000);
        String token = String.valueOf(tokenNum);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        return token;
    }

    @Transactional
    public boolean reestablecerPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElse(null);
        if (resetToken == null || resetToken.isUsed() ||
                resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        Usuario usuario = usuarioRepository.findByEmail(resetToken.getEmail())
                .orElse(null);
        if (usuario == null) {
            return false;
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return true;
    }
}
