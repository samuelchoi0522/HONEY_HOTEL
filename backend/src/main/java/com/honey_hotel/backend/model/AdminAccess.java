package com.honey_hotel.backend.model;

import jakarta.persistence.*;

/**
 * Class pertaining to admin access
 *
 * @author Samuel Choi
 * @Version 1.0 (11/19/24)
 */
@Entity
@Table(name = "admin_access")
public class AdminAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
