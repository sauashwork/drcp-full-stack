package com.drcp.backend.service;

import com.drcp.backend.entity.Users;
import com.drcp.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    @Autowired
    private JwtService jwtService;

    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        usersRepository.save(user);
        return user;
    }

    public ResponseEntity<?> verify(Users user){

        final Set<String> ALLOWED_ROLES=Set.of("USER", "VOLUNTEER", "ADMIN");

        Users dbUser=usersRepository.findByUsername((user.getUsername()));
        if(dbUser==null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not yet registered..."));
        if(!ALLOWED_ROLES.contains(dbUser.getRole().toUpperCase())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "register with allowed roles only to login"));
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()){
            String token=jwtService.generateToken(user.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid credentials"));
        }
    }

    public Users fetchUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }
}
