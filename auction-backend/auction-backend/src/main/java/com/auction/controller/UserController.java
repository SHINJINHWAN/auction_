package com.auction.controller;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String usernameOrEmail = loginRequest.get("usernameOrEmail");
            String password = loginRequest.get("password");
            
            // 사용자 인증
            Optional<User> userOpt = userService.authenticate(usernameOrEmail, password);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // JWT 토큰 생성
                Map<String, Object> claims = Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole()
                );
                String token = jwtUtil.generateToken(claims, user.getEmail());
                
                // 응답 데이터 구성
                Map<String, Object> response = Map.of(
                    "token", token,
                    "user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "nickname", user.getNickname(),
                        "role", user.getRole()
                    )
                );
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } catch (Exception e) {
            logger.error("로그인 실패", e);
            return ResponseEntity.status(500).body("Login failed");
        }
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
                        User user = userOpt.get();
                        // JSON 형태로 사용자 정보 반환
                        Map<String, Object> userInfo = Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "email", user.getEmail(),
                            "nickname", user.getNickname(),
                            "role", user.getRole()
                        );
                        return ResponseEntity.ok(userInfo);
                    }
                }
            }
            // JSON 형태로 에러 응답
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        } catch (Exception e) {
            logger.error("토큰 검증 실패", e);
            return ResponseEntity.status(401).body(Map.of("error", "Token validation failed"));
        }
    }

    // @GetMapping("/oauth2/success")
    // public ResponseEntity<?> oauth2Success(@RequestParam("token") String token) {
    //     Map<String, Object> result = new HashMap<>();
    //     result.put("token", token);
    //     return ResponseEntity.ok(result);
    // }
} 