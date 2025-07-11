package com.auction.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.UserDto;
import com.auction.entity.User;
import com.auction.service.UserService;
import com.auction.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        User user = userService.register(userDto);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.getSubject(token);
                    Optional<User> userOpt = userService.findByEmail(email);
                    if (userOpt.isPresent()) {
                        return ResponseEntity.ok(userOpt.get());
                    }
                }
            }
            return ResponseEntity.status(401).body("Invalid token");
        } catch (Exception e) {
            logger.error("토큰 검증 실패", e);
            return ResponseEntity.status(401).body("Invalid token");
        }
    }

    // @GetMapping("/oauth2/success")
    // public ResponseEntity<?> oauth2Success(@RequestParam("token") String token) {
    //     Map<String, Object> result = new HashMap<>();
    //     result.put("token", token);
    //     return ResponseEntity.ok(result);
    // }
} 