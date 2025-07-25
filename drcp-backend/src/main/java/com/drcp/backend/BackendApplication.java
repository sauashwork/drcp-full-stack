package com.drcp.backend;

import com.drcp.backend.configs.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		DotenvInitializer.loadEnv();
		SpringApplication.run(BackendApplication.class, args);
	}

}
