package com.packt.cardatabase.domain;

public record AccountCredentials(String username, String password) {
    public AccountCredentials {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }
    }

}
