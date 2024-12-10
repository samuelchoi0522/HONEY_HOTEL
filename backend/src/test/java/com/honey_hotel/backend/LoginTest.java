package com.honey_hotel.backend;

import com.honey_hotel.backend.controller.LoginController;
import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.service.LoginService;

import java.util.Optional;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class LoginTest {
    @Mock
    private LoginService loginService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @InjectMocks
    private LoginController loginController;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        when(request.getSession(true)).thenReturn(session);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void testLoginUserSuccess() {
        AppUser inputUser = new AppUser();
        inputUser.setEmail("kirby@gmail.com");
        inputUser.setPassword("password");

        AppUser existingUser = new AppUser();
        existingUser.setEmail("kirby@gmail.com");
        existingUser.setPassword("password");

        when(loginService.validateUserCredentials("kirby@gmail.com", "password"))
                .thenReturn(Optional.of(existingUser));

        ResponseEntity<?> response = loginController.loginUser(inputUser, request);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Login successful!", response.getBody());
        verify(loginService, times(1)).validateUserCredentials("kirby@gmail.com", "password");
        verify(loginService, times(1)).setSession(request, existingUser);
    }

    @Test
    void testLoginUserInvalidCredentials() {
        AppUser inputUser = new AppUser();
        inputUser.setEmail("kirby@gmail.com");
        inputUser.setPassword("notpassword");

        when(loginService.validateUserCredentials("kirby@gmail.com", "notpassword"))
                .thenReturn(Optional.empty());

        ResponseEntity<?> response = loginController.loginUser(inputUser, request);

        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password.", response.getBody());
        verify(loginService, times(1)).validateUserCredentials("kirby@gmail.com", "notpassword");
        verify(loginService, never()).setSession(any(), any());
    }

    @Test
    void testLoginUserMissingFields() {
        AppUser inputUser = new AppUser();
        inputUser.setEmail(null);
        inputUser.setPassword(null);

        ResponseEntity<?> response = loginController.loginUser(inputUser, request);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("A required field is missing.", response.getBody());
        verify(loginService, never()).validateUserCredentials(anyString(), anyString());
        verify(loginService, never()).setSession(any(), any());
    }
}
