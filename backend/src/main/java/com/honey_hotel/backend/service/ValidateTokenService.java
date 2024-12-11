package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.PasswordResetToken;
import com.honey_hotel.backend.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.honey_hotel.backend.model.AppUser;

import java.time.LocalDateTime;

/**
 * Service class to validate tokens
 *
 * @author Samuel Choi
 * @Version 11/8/24
 */
@Service
public class ValidateTokenService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    /**
     * Validates the token passed on through
     *
     * @param token, token string
     * @return true if token exists and is not expired, false otherwise
     */
    public boolean validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken == null) {
            return false;
        }

        return resetToken.getExpiryDate().isAfter(LocalDateTime.now());
    }

    /**
     * Invalidates a token so that it cannot be used again
     *
     * @param token, token string
     */
    public void invalidateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken != null) {
            tokenRepository.delete(resetToken);
        }
    }

    /**
     * Gets a user from the token
     *
     * @param token, token string
     * @return AppUser, user who is linked to an active token, returns null if token does not exist
     */
    public AppUser getUserByToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

        if (resetToken == null) {
            return null;
        }

        return resetToken.getUser();
    }
}
