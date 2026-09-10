package com.campus.config;
import com.campus.entity.*; import com.campus.repository.UserRepository; import org.springframework.beans.factory.annotation.*; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.*; import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration public class AdminSeeder {
 @Bean CommandLineRunner seedAdmin(UserRepository repo,PasswordEncoder encoder,@Value("${app.admin.email:admin@campus.local}") String email,@Value("${app.admin.password:Admin@12345}") String password){return args->{if(repo.findByEmail(email).isEmpty())repo.save(User.builder().email(email).password(encoder.encode(password)).role(Role.ADMIN).enabled(true).build());};}
}
