package com.honey_hotel.backend.utility;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String projectDirectory = System.getProperty("user.dir");

        Dotenv dotenv = Dotenv.configure()
                .directory(projectDirectory)
                .load();

        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        Logger logger = LoggerFactory.getLogger(DotenvEnvironmentPostProcessor.class);
        dotenv.entries().forEach(entry -> logger.info(entry.getKey() + "=" + entry.getValue()));
    }
}
