package com.campus.service;
import com.campus.dto.AuthDtos.*; import com.campus.entity.*; import com.campus.repository.*; import com.campus.security.JwtService; import org.junit.jupiter.api.Test; import org.junit.jupiter.api.extension.ExtendWith; import org.mockito.*; import org.springframework.security.crypto.password.PasswordEncoder; import static org.junit.jupiter.api.Assertions.*; import static org.mockito.Mockito.*; import java.util.*;
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class) class AuthServiceTest {
 @Mock UserRepository users; @Mock StudentRepository students; @Mock PasswordEncoder encoder; @Mock JwtService jwt; @InjectMocks AuthService service;
 @Test void loginReturnsToken(){User u=User.builder().id(1L).email("s@test.com").password("hash").role(Role.STUDENT).enabled(true).build();when(users.findByEmail("s@test.com")).thenReturn(Optional.of(u));when(encoder.matches("secret","hash")).thenReturn(true);when(jwt.generate("s@test.com","STUDENT")).thenReturn("token");assertEquals("token",service.login(new LoginRequest("s@test.com","secret")).token());}
 @Test void duplicateEmailRejected(){when(users.findByEmail("s@test.com")).thenReturn(Optional.of(new User()));assertThrows(IllegalArgumentException.class,()->service.register(new RegisterRequest("s@test.com","secret","A","R1","C","3","9")));}
}
