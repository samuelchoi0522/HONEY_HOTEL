package com.honey_hotel.backend;

import com.honey_hotel.backend.service.AdminAccessService;
import com.honey_hotel.backend.repository.AdminAccessRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class AdminTest {
    @Mock
    private AdminAccessRepository adminAccessRepository;

    @InjectMocks
    private AdminAccessService adminAccessService;

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
    void testIsAdmin() {
        String email = "admin@gmail.com";

        when(adminAccessRepository.existsByEmail(email)).thenReturn(true);

        boolean result = adminAccessService.isAdmin(email);

        assertTrue(result);
        verify(adminAccessRepository, times(1)).existsByEmail(email);
    }

    @Test
    void testCheckIfExists() {
        Long id = 1L;

        when(adminAccessRepository.existsById(id)).thenReturn(true);

        boolean result = adminAccessService.checkIfExists(id);

        assertTrue(result);
        verify(adminAccessRepository, times(1)).existsById(id);
    }

    @Test
    void testCheckEmail() {
        String email = "fake@gmail.com";

        when(adminAccessRepository.existsByEmail(email)).thenReturn(false);

        boolean result = adminAccessService.checkEmail(email);

        assertFalse(result);
        verify(adminAccessRepository, times(1)).existsByEmail(email);
    }

    @Test
    void testRemoveAdmin() {
        Long id = 2L;

        doNothing().when(adminAccessRepository).deleteById(id);

        adminAccessService.removeAdmin(id);

        verify(adminAccessRepository, times(1)).deleteById(id);
    }
}
