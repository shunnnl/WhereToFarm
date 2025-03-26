package com.backend.farmbti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class FarmbtiApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmbtiApplication.class, args);
    }

}
