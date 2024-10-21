package com.honey_hotel.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.repository.UserRepository;
import static com.honey_hotel.backend.utility.PasswordUtils.hashPassword;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    public Optional<AppUser> validateUserCredentials(String email, String password) {
        String hashedPassword = hashPassword(password);
        Optional<AppUser> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(hashedPassword)) {
            return userOpt;
        }
        return Optional.empty();
    }

    public void setSession(HttpServletRequest request, AppUser user) {
        HttpSession session = request.getSession(true);
        session.setAttribute("user", user);
        System.out.println(user.getEmail() + " has logged in with session ID: " + session.getId());
    }

    public boolean isUserLoggedIn(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null && session.getAttribute("user") != null;
    }

    public void invalidateSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}
