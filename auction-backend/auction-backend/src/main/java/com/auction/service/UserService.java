package com.auction.service;

import java.util.Optional;

import com.auction.dto.UserDto;
import com.auction.entity.User;

public interface UserService {
    User register(UserDto userDto);
    User login(String usernameOrEmail, String password);
    Optional<User> authenticate(String usernameOrEmail, String password);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
} 