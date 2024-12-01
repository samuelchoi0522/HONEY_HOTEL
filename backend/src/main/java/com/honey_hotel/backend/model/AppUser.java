package com.honey_hotel.backend.model;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 Main App User class with functionalities
 @author Samuel Choi
 @version 4.0 (Oct 5 2024)
 */
@Entity
@Table(name = "users")
@CrossOrigin(origins = "http://localhost:3000")
public class AppUser implements Serializable {

    /**
     * Serial version ID of user
     */
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Unique identifier of the user automatically generated by the database
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The title of user (e.g., Mr., Ms.)
     */
    private String title;

    /**
     * The first name of user
     */
    private String firstname;

    /**
     * The last name of user
     */
    private String lastname;

    /**
     * The email address of user
     */
    private String email;
    private String password_hash;

    /**
     * The hashed password for the user
     */
    private String password_hash;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;

    // Getters and Setters
    /**
     * Gets the title of the user
     *
     * @return user title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of the user
     *
     * @param title title to set for the user
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the unique identifier of the user
     *
     * @return user ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the user
     *
     * @param id ID to set for the user
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the first name of the user
     *
     * @return first name of the user
     */
    public String getFirstname() {
        return firstname;
    }

    /**
     * Sets the first name of the user
     *
     * @param firstname first name to set for the user
     */
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    /**
     * Gets the last name of the user
     *
     * @return last name of the user
     */
    public String getLastname() {
        return lastname;
    }

    /**
     * Sets the last name of the user
     *
     * @param lastname last name to set for the user
     */
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    /**
     * Gets the email address of the user
     *
     * @return email address of the user
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email address of the user
     *
     * @param email email address to set for the user
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Gets the password hash of the user
     *
     * @return password hash of the user
     */
    public String getPassword() {
        return password_hash;
    }

    /**
     * Sets the password hash for the user
     *
     * @param password_hash password hash to set for the user
     */
    public void setPassword(String password_hash) {
        this.password_hash = password_hash;
    }
}