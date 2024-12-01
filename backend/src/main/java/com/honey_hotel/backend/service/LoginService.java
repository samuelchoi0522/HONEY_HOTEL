package com.honey_hotel.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.repository.UserRepository;
import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 Service class for login functionality
 @author Samuel Choi
 @version 1.0 (Oct 11 2024)
 */
@Service
public class LoginService {

    /**
     * Repository of all users
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Given user inputted email and password information, check if user exists by looking
     * through user repository for matching credentials
     *
     * @param email inputted by user
     * @param password inputted by user
     * @return user credentials if matching user details exists, empty if does not exist
     */
    public Optional<AppUser> validateUserCredentials(String email, String password) {
        String hashedPassword = hashPassword(password);
        Optional<AppUser> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(hashedPassword)) {
            return userOpt;
        }
        return Optional.empty();
    }

    /**
     * Sets the session for the client user on the webpage, storing their login information
     * into the server
     *
     * @param request HTTP session request by client containing session information
     * @param user appUser representing logged in user
     */
    public void setSession(HttpServletRequest request, AppUser user) {
        HttpSession session = request.getSession(true);
        session.setAttribute("user", user);
        System.out.println(user.getEmail() + " has logged in with session ID: " + session.getId());
    }

    /**
     * Checks the HTTP session information to see if the user logged in
     *
     * @param request HTTP session request by client containing session information
     * @return true if the user is logged in, false otherwise
     */
    public boolean isUserLoggedIn(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null && session.getAttribute("user") != null;
    }

    /**
     * Invalidates the current user's session, effectively logging them out.
     *
     * @param request the HTTP request containing session information
     */
    public void invalidateSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}
