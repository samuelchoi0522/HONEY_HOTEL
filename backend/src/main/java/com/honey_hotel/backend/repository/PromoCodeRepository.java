package com.honey_hotel.backend.repository;

import com.honey_hotel.backend.model.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for promo codes
 *
 * @author Samuel Choi
 * @Version 1.0 (10/30/24)
 */
@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Optional<PromoCode> findByNameAndIsActiveTrue(String name);
}
