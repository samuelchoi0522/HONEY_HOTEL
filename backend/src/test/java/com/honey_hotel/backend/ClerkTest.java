package com.honey_hotel.backend;

import com.honey_hotel.backend.service.ClerkAccessService;
import com.honey_hotel.backend.repository.ClerkAccessRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ClerkTest {
    @Mock
    private ClerkAccessRepository clerkAccessRepository;

    @InjectMocks
    private ClerkAccessService clerkAccessService;

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
    void testIsClerk() {
        String email = "test@gmail.com";

        when(clerkAccessRepository.existsByEmail(email)).thenReturn(true);

        boolean result = clerkAccessService.isClerk(email);

        assertTrue(result);
        verify(clerkAccessRepository, times(1)).existsByEmail(email);
    }

    @Test
    void testCheckIfExists() {
        Long id = 1L;

        when(clerkAccessRepository.existsById(id)).thenReturn(true);

        boolean result = clerkAccessService.checkIfExists(id);

        assertTrue(result);
        verify(clerkAccessRepository, times(1)).existsById(id);
    }

    @Test
    void testCheckEmail() {
        String email = "test@gmail.com";

        when(clerkAccessRepository.existsByEmail(email)).thenReturn(false);

        boolean result = clerkAccessService.checkEmail(email);

        assertFalse(result);
        verify(clerkAccessRepository, times(1)).existsByEmail(email);
    }

    @Test
    void testRemoveClerk() {
        Long id = 2L;

        doNothing().when(clerkAccessRepository).deleteById(id);

        clerkAccessService.removeClerk(id);

        verify(clerkAccessRepository, times(1)).deleteById(id);
    }
}
