package com.honey_hotel.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.honey_hotel.backend.model.PasswordResetToken;

/**
 * Repository for password resetting utilizing a token link sent through email
 *
 * @author Samuel Choi
 * @Version 2.0 (11/8/24)
 */
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}
