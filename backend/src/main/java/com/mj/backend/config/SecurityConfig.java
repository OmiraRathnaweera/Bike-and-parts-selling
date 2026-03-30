package com.mj.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://OmiraRathnaweera.github.io")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Fully public — no token needed
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login",
                                "/api/admin/register",
                                "/api/admin/login",
                                "/api/admin/slots",
                                "/api/verify/send",
                                "/api/verify/confirm",
                                "/api/password/forgot",
                                "/api/password/reset",
                                "/api/contact"
                        ).permitAll()

                        // Bikes: public reads, protected writes
                        .requestMatchers(HttpMethod.GET,    "/api/bikes/**").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/api/bikes/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/api/bikes/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH,  "/api/bikes/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/bikes/**").authenticated()

                        // Reviews: public reads, protected writes
                        .requestMatchers(HttpMethod.GET,    "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/api/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/api/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()

                        // Everything else requires a valid JWT
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
