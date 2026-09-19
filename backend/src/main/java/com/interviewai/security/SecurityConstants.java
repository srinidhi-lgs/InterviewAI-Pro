package com.interviewai.security;

public final class SecurityConstants {

    private SecurityConstants() {
        // Prevent instantiation
    }

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_CANDIDATE = "ROLE_CANDIDATE";
    public static final String TOKEN_TYPE = "Bearer";
    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
}
