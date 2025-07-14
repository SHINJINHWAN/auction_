package com.auction.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auction.dto.UserDto;
import com.auction.service.EmailService;
import com.auction.service.LoginHistoryService;
import com.auction.service.UserService;
import com.auction.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private LoginHistoryService loginHistoryService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req, HttpServletRequest request) {
        String username = req.get("username");
        String password = req.get("password");
        
        UserDto user = userService.findByUsernameDto(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            // 로그인 실패 기록
            loginHistoryService.recordLoginAttempt(username, request.getRemoteAddr(), 
                request.getHeader("User-Agent"), "FAILED", "Invalid credentials");
            return ResponseEntity.status(401).body(Map.of("error", "아이디 또는 비밀번호가 올바르지 않습니다."));
        }

        if (!user.getEmailVerified()) {
            return ResponseEntity.status(401).body(Map.of("error", "이메일 인증이 필요합니다."));
        }

        // 로그인 성공 기록
        loginHistoryService.recordLoginAttempt(username, request.getRemoteAddr(), 
            request.getHeader("User-Agent"), "SUCCESS", null);
        
        // 마지막 로그인 시간 업데이트
        userService.updateLastLogin(user.getId(), request.getRemoteAddr());

        String accessToken = jwtUtil.generateAccessToken(username, List.of(user.getRole()));
        String refreshToken = jwtUtil.generateRefreshToken(username);
        
        // Refresh Token 저장
        userService.updateRefreshToken(user.getId(), refreshToken);

        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "user", user
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.getUsername(token);
        userService.clearRefreshToken(username);
        return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        if (userService.findByUsernameDto(userDto.getUsername()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "이미 존재하는 아이디입니다."));
        }
        if (userService.findByEmailDto(userDto.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "이미 존재하는 이메일입니다."));
        }

        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userDto.setEmailVerified(false);
        userDto.setRole("USER");
        
        // 이메일 인증 토큰 생성
        String verificationToken = UUID.randomUUID().toString();
        userDto.setEmailVerificationToken(verificationToken);
        userDto.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));

        UserDto savedUser = userService.save(userDto);
        
        // 이메일 인증 메일 발송
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다. 이메일을 확인해주세요."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        UserDto user = userService.findByEmailVerificationToken(token);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "유효하지 않은 인증 토큰입니다."));
        }
        if (user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "인증 토큰이 만료되었습니다."));
        }

        userService.verifyEmail(user.getId());
        return ResponseEntity.ok(Map.of("message", "이메일 인증이 완료되었습니다."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token이 필요합니다."));
        }

        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "유효하지 않은 refresh token입니다."));
        }

        String username = jwtUtil.getUsername(refreshToken);
        UserDto user = userService.findByUsernameDto(username);
        if (user == null || !refreshToken.equals(user.getRefreshToken())) {
            return ResponseEntity.status(401).body(Map.of("error", "유효하지 않은 refresh token입니다."));
        }

        String newAccessToken = jwtUtil.generateAccessToken(username, List.of(user.getRole()));
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.getUsername(token);
        UserDto user = userService.findByUsernameDto(username);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        UserDto user = userService.findByEmailDto(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "존재하지 않는 이메일입니다."));
        }
        if (user.getEmailVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "이미 인증된 이메일입니다."));
        }

        String verificationToken = UUID.randomUUID().toString();
        userService.updateEmailVerificationToken(user.getId(), verificationToken);
        
        emailService.sendVerificationEmail(email, verificationToken);
        return ResponseEntity.ok(Map.of("message", "인증 메일을 다시 발송했습니다."));
    }
} 