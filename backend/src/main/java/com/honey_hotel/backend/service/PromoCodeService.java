package com.honey_hotel.backend.service;

import com.honey_hotel.backend.model.PromoCode;
import com.honey_hotel.backend.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class PromoCodeService {

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    public Optional<PromoCode> validatePromoCode(String code) {
        Optional<PromoCode> promoCode = promoCodeRepository.findByNameAndIsActiveTrue(code);

        if (promoCode.isPresent()) {
            PromoCode foundCode = promoCode.get();
            // Check if promo code is within its valid date range
            LocalDate today = LocalDate.now();
            if (!today.isBefore(foundCode.getCreationDate()) && !today.isAfter(foundCode.getExpirationDate())) {
                return Optional.of(foundCode);
            }
        }
        return Optional.empty();
    }
}
