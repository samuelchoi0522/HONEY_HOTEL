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
        serializer.setSameSite("None");
        serializer.setCookiePath("/"); 
        serializer.setUseHttpOnlyCookie(true); 
        serializer.setUseSecureCookie(true);  
        return serializer;
    }
}
