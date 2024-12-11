package com.honey_hotel.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.honey_hotel.backend.model.PromoCode;
import com.honey_hotel.backend.service.PromoCodeService;

@RestController
@RequestMapping("/api/promo")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PromoCodeController {

    @Autowired
    private PromoCodeService promoCodeService;

    /**
     * Validates if a promo code entered by a user is within the database
     *
     * @param request, map of string received by the frontend from the user
     * @return Response Map Entity with validity boolean and discount percentage
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validatePromoCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");

        Optional<PromoCode> promoCode = promoCodeService.validatePromoCode(code);
        if (promoCode.isPresent()) {
            PromoCode validCode = promoCode.get();
            return ResponseEntity.ok(Map.of(
                    "isValid", true,
                    "discountPercentage", validCode.getDiscountPercentage()));
        } else {
            return ResponseEntity.ok(Map.of("isValid", false, "message", "Invalid or expired promo code"));
        }
    }
}
