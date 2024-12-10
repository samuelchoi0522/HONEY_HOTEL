package com.honey_hotel.backend;

import com.honey_hotel.backend.controller.ForgotPasswordController;
import com.honey_hotel.backend.service.ForgotPasswordService;

import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ForgotPasswordTest {
    @Mock
    private ForgotPasswordService forgotPasswordService;

    @InjectMocks
    private ForgotPasswordController forgotPasswordController;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void testSendResetLinkSuccess() {
        Map<String, String> request = new HashMap<>();
        request.put("email", "kirby@gmail.com");

        when(forgotPasswordService.sendResetToken("kirby@gmail.com")).thenReturn(true);

        ResponseEntity<String> response = forgotPasswordController.sendResetLink(request);
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password reset link sent successfully.", response.getBody());
        verify(forgotPasswordService, times(1)).sendResetToken("kirby@gmail.com");
    }

    @Test
    void testSendResetLinkFailure() {
        Map<String, String> request = new HashMap<>();
        request.put("email", "notkirby@gmail.com");

        when(forgotPasswordService.sendResetToken("notkirby@gmail.com")).thenReturn(false);

        ResponseEntity<String> response = forgotPasswordController.sendResetLink(request);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("System error. Please try again later.", response.getBody());
        verify(forgotPasswordService, times(1)).sendResetToken("notkirby@gmail.com");
    }

    @Test
    void testSendResetLinkWithMissingEmail() {
        Map<String, String> request = new HashMap<>();

        ResponseEntity<String> response = forgotPasswordController.sendResetLink(request);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("System error. Please try again later.", response.getBody());
        verify(forgotPasswordService, never()).sendResetToken(anyString());
    }
}
