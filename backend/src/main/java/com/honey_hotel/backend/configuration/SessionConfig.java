package com.honey_hotel.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
public class SessionConfig {

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setSameSite("None");  // Use "None" for cross-origin requests
        serializer.setCookiePath("/");   // Ensure the cookie is valid site-wide
        serializer.setUseHttpOnlyCookie(true);  // Only HTTP (no JS access)
        serializer.setUseSecureCookie(true);    // Secure flag, set to true for HTTPS
        return serializer;
    }
}
