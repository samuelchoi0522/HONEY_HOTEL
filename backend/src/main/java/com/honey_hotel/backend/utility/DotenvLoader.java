package com.honey_hotel.backend.utility;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

import java.util.logging.Logger;

import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvLoader {

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure().directory("/Users/sam/Desktop/SWE 1/FULLSTACK_HOTEL_APP/.env").load();
        Logger logger = Logger.getLogger(DotenvLoader.class.getName());
        String dbUsername = dotenv.get("DB_USERNAME");
        String dbPassword = dotenv.get("DB_PASSWORD");
        String emailUsername = dotenv.get("EMAIL_USERNAME");
        String emailPassword = dotenv.get("EMAIL_PASSWORD");

        if(dbUsername != null) System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        if(dbPassword != null) System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        if(emailUsername != null) System.setProperty("EMAIL_USERNAME", dotenv.get("EMAIL_USERNAME"));
        if (emailPassword != null)
            System.setProperty("EMAIL_PASSWORD", dotenv.get("EMAIL_PASSWORD"));
        
        logger.info("Username: " + dbUsername);

    }
}
