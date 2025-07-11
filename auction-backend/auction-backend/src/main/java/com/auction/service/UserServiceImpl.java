package com.auction.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auction.dto.UserDto;
import com.auction.entity.User;
import com.auction.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        // 비밀번호를 평문으로 저장
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setRole("USER"); // 기본값 USER
        return userRepository.save(user);
    }

    @Override
    public User login(String username, String password) {
        java.util.Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        User user = userOpt.get();
        // 평문 비교
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
} 