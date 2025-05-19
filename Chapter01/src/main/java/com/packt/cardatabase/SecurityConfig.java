package com.packt.cardatabase;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.packt.cardatabase.service.UserDetailsServiceImpl;

// Add the following static import
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /*
     * @Bean
     * public InMemoryUserDetailsManager userDetailsService() {
     * UserDetails user =
     * User.builder().username("user").password(passwordEncoder().encode("password")
     * )
     * .roles("USER").build();
     * return new InMemoryUserDetailsManager(user);
     * }
     */

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthenticationFilter authenticationFilter;
    private final AuthEntryPoint authEntryPoint;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, AuthenticationFilter authenticationFilter,
            AuthEntryPoint authEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.authenticationFilter = authenticationFilter;
        this.authEntryPoint = authEntryPoint;
    }

    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    // Add Global CORS filter inside the class
/*     @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("*"));
        config.setAllowedHeaders(Arrays.asList("*"));
        // localhost:3000 is allowed
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowCredentials(false);
        config.applyPermitDefaultValues();
        source.registerCorsConfiguration("/**", config);
        return source;
    } */

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Add this one
        http.csrf(csrf -> csrf.disable()).cors(withDefaults())
                .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests.anyRequest().permitAll());
        /*
         * http.csrf((csrf) -> csrf.disable())
         * .cors(withDefaults())
         * .sessionManagement(
         * (sessionManagement) ->
         * sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
         * 
         * .authorizeHttpRequests((authorizeHttpRequests) -> authorizeHttpRequests
         * .requestMatchers(HttpMethod.GET, "/api/cars").hasAnyRole("USER", "ADMIN")
         * .requestMatchers(HttpMethod.POST, "/api/cars").hasRole("ADMIN")
         * .requestMatchers(HttpMethod.PUT, "/api/cars").hasRole("ADMIN")
         * .requestMatchers(HttpMethod.DELETE, "/api/owners").hasRole("ADMIN"))
         * .addFilterBefore(authenticationFilter,
         * UsernamePasswordAuthenticationFilter.class)
         * .authorizeHttpRequests((authorizeHttpRequests) ->
         * authorizeHttpRequests.requestMatchers(HttpMethod.POST,
         * "/login").permitAll().anyRequest().authenticated())
         * .exceptionHandling((exceptionHandling) ->
         * exceptionHandling.authenticationEntryPoint(authEntryPoint));
         * 
         */
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

}
