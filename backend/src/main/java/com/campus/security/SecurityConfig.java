package com.campus.security;

import com.campus.repository.UserRepository;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
 private final JwtAuthFilter jwtFilter;
 public SecurityConfig(JwtAuthFilter f){jwtFilter=f;}
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean UserDetailsService userDetailsService(UserRepository users){
  return username -> users.findByEmail(username)
    .map(u -> User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole().name()).disabled(!u.isEnabled()).build())
    .orElseThrow(()->new UsernameNotFoundException("User not found"));
 }
 @Bean SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
  http.csrf(c->c.disable()).cors(c->c.configurationSource(corsConfigurationSource())).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/swagger-ui/**","/swagger-ui.html","/api-docs/**").permitAll().requestMatchers("/api/admin/**").hasRole("ADMIN").anyRequest().authenticated())
   .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class); return http.build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource(){CorsConfiguration c=new CorsConfiguration();c.setAllowedOrigins(List.of("http://localhost:5173"));c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));c.setAllowedHeaders(List.of("*"));c.setAllowCredentials(true);UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;}
}
