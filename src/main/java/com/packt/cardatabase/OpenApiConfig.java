package com.packt.cardatabase;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI carDatabaseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Car Rest API")
                        .version("1.0")
                        .description("API for managing car database"));
    }
}

