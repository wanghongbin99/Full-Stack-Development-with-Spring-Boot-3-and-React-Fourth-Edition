package com.packt.cardatabase.service;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtService {
    static final long EXPIRATIONTIME = 86400000;
    // 1 day in ms. Should be shorter in production.
    static final String PREFIX = "Bearer";

    static final String SECRET = "your-very-secret-key-which-should-be-long-enough";
    static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
    private static final Logger logger = Logger.getLogger(JwtService.class.getName());

    // Generate signed JWT token
    public String getToken(Authentication auth) {
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        logger.info("Roles for the getToken: " + roles);

        return Jwts.builder()
                .setSubject(auth.getName())
                .claim("roles", roles)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                .signWith(key)
                .compact();
    }

    // Get a token from request Authorization header,
    // verify the token, and get username
    public String getAuthUser(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        logger.info("Token: " + token);

        if (token != null) {
            Claims claims = getClaims(token);
            String user = claims.getSubject();
            logger.info("User: " + user);
            @SuppressWarnings("unchecked")
            List<String> roles = claims.get("roles", List.class);
            logger.info("Roles: " + roles);
            if (user != null && roles != null) {
                return user;
            }
        }
        return null;
    }

    public Claims getClaims(String token) {
       return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token.replace(PREFIX, ""))
                .getBody();
                
    }
}
