package com.drcp.backend.configs;

import io.github.cdimascio.dotenv.Dotenv;
import java.util.Objects;

public class DotenvInitializer {

    public static void loadEnv(){
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        System.setProperty("DB_URL", Objects.requireNonNull(dotenv.get("DB_URL")));
        System.setProperty("DB_USERNAME", Objects.requireNonNull(dotenv.get("DB_USERNAME")));
        System.setProperty("DB_PASSWORD", Objects.requireNonNull(dotenv.get("DB_PASSWORD")));
    }
}
