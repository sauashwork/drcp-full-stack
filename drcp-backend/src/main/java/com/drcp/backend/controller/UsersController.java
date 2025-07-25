package com.drcp.backend.controller;

import com.drcp.backend.entity.Users;
import com.drcp.backend.repository.UsersRepository;
import com.drcp.backend.service.JwtService;
import com.drcp.backend.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return usersService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user){
        System.out.println("User req: "+user);
        return usersService.verify(user);
    }

    @GetMapping("/user")
    public ResponseEntity<Users> getUserDetails(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtService.extractUserName(token);
        Users user = usersService.fetchUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/expirationTime")
    public ResponseEntity<?> getExpirationTime(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Date expirationTime=jwtService.getExpirationTime(token);
        return ResponseEntity.ok(expirationTime);
    }

}
