package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.PasswordResetToken;
import com.honey_hotel.backend.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.honey_hotel.backend.model.AppUser;

import java.time.LocalDateTime;

@Service
public class ValidateTokenService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    public boolean validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken == null) {
            return false;
        }

        return resetToken.getExpiryDate().isAfter(LocalDateTime.now());
    }

    public void invalidateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken != null) {
            tokenRepository.delete(resetToken);
        }
    }

    public AppUser getUserByToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken == null) {
            return null;
        }

        return resetToken.getUser();
    }
}
