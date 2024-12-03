package com.honey_hotel.backend.controller;

import com.honey_hotel.backend.model.PromoCode;
import com.honey_hotel.backend.service.PromoCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/promo")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PromoCodeController {

    @Autowired
    private PromoCodeService promoCodeService;

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
