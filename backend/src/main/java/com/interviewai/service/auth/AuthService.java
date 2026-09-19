package com.interviewai.service.auth;

import com.interviewai.dto.auth.AuthResponse;
import com.interviewai.dto.auth.LoginRequest;
import com.interviewai.dto.auth.RefreshTokenRequest;
import com.interviewai.dto.auth.RegisterRequest;
import com.interviewai.entity.RefreshToken;
import com.interviewai.entity.Role;
import com.interviewai.entity.User;
import com.interviewai.entity.UserRole;
import com.interviewai.exception.EmailAlreadyExistsException;
import com.interviewai.exception.InvalidCredentialsException;
import com.interviewai.exception.InvalidRefreshTokenException;
import com.interviewai.exception.ResourceNotFoundException;
import com.interviewai.exception.ValidationException;
import com.interviewai.mapper.UserMapper;
import com.interviewai.repository.RefreshTokenRepository;
import com.interviewai.repository.RoleRepository;
import com.interviewai.repository.UserRepository;
import com.interviewai.repository.UserRoleRepository;
import com.interviewai.security.SecurityConstants;
import com.interviewai.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(final RegisterRequest request) {
        log.info("Starting user registration for email: {}", request.getEmail());

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            log.warn("Registration failed: Passwords do not match for email: {}", request.getEmail());
            throw new ValidationException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists: {}", request.getEmail());
            throw new EmailAlreadyExistsException("Email already in use");
        }

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        log.info("User entity saved successfully for email: {}", request.getEmail());

        final Role role = roleRepository.findByName(SecurityConstants.ROLE_CANDIDATE)
                .orElseThrow(() -> {
                    log.error("Critical error: {} not found in database", SecurityConstants.ROLE_CANDIDATE);
                    return new ResourceNotFoundException(SecurityConstants.ROLE_CANDIDATE + " not found in database");
                });

        final UserRole userRole = new UserRole(user, role);
        userRoleRepository.save(userRole);
        log.info("Assigned role {} to user email: {}", SecurityConstants.ROLE_CANDIDATE, request.getEmail());

        final String accessToken = jwtService.generateAccessToken(user);
        final String refreshToken = jwtService.generateRefreshToken(user);

        final RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiresAt(jwtService.extractExpiration(refreshToken))
                .isRevoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);
        log.info("Refresh token generated and saved for email: {}", request.getEmail());

        final long expiresInSeconds = (jwtService.extractExpiration(accessToken).toEpochMilli() - Instant.now().toEpochMilli()) / 1000;

        final AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(SecurityConstants.TOKEN_TYPE)
                .expiresIn(expiresInSeconds)
                .userId(user.getId())
                .email(user.getEmail())
                .roles(List.of(role.getName()))
                .build();

        log.info("User registered successfully for email: {}", request.getEmail());

        return authResponse;
    }

    @Transactional
    public AuthResponse login(final LoginRequest request) {
        log.info("Login started for email: {}", request.getEmail());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            log.warn("Invalid credentials for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        final User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Unexpected authentication failure: User not found in database after successful auth: {}", request.getEmail());
                    return new ResourceNotFoundException("User not found");
                });

        final List<RefreshToken> activeTokens = refreshTokenRepository.findByUser(user).stream()
                .filter(token -> !token.getIsRevoked())
                .toList();

        if (!activeTokens.isEmpty()) {
            activeTokens.forEach(token -> token.setIsRevoked(true));
            refreshTokenRepository.saveAll(activeTokens);
            log.info("Existing refresh tokens revoked for email: {}", request.getEmail());
        }

        final String accessToken = jwtService.generateAccessToken(user);
        final String refreshToken = jwtService.generateRefreshToken(user);

        final RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiresAt(jwtService.extractExpiration(refreshToken))
                .isRevoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);
        log.info("New refresh token created for email: {}", request.getEmail());

        final long expiresInSeconds = (jwtService.extractExpiration(accessToken).toEpochMilli() - Instant.now().toEpochMilli()) / 1000;

        final List<String> roles = user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .toList();

        final AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(SecurityConstants.TOKEN_TYPE)
                .expiresIn(expiresInSeconds)
                .userId(user.getId())
                .email(user.getEmail())
                .roles(roles)
                .build();

        log.info("Login successful for email: {}", request.getEmail());

        return authResponse;
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(final RefreshTokenRequest request) {
        log.info("Refresh token request received");

        final RefreshToken tokenEntity = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> {
                    log.warn("Invalid refresh token: Token not found in database");
                    return new InvalidRefreshTokenException("Invalid refresh token.");
                });

        if (tokenEntity.getIsRevoked() != null && tokenEntity.getIsRevoked()) {
            log.warn("Revoked refresh token attempt for user id: {}", tokenEntity.getUser().getId());
            throw new InvalidRefreshTokenException("Refresh token is revoked.");
        }

        if (tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Expired refresh token attempt for user id: {}", tokenEntity.getUser().getId());
            throw new InvalidRefreshTokenException("Refresh token is expired.");
        }

        log.info("Refresh token validated successfully for user id: {}", tokenEntity.getUser().getId());

        final User user = tokenEntity.getUser();

        final String accessToken = jwtService.generateAccessToken(user);
        final long expiresInSeconds = (jwtService.extractExpiration(accessToken).toEpochMilli() - Instant.now().toEpochMilli()) / 1000;

        final List<String> roles = user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .toList();

        final AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(tokenEntity.getToken())
                .tokenType(SecurityConstants.TOKEN_TYPE)
                .expiresIn(expiresInSeconds)
                .userId(user.getId())
                .email(user.getEmail())
                .roles(roles)
                .build();

        log.info("New access token generated successfully for user id: {}", user.getId());

        return authResponse;
    }

    @Transactional
    public void logout(final RefreshTokenRequest request) {
        log.info("Logout requested");

        try {
            final RefreshToken tokenEntity = refreshTokenRepository.findByToken(request.getRefreshToken())
                    .orElseThrow(() -> {
                        log.warn("Invalid refresh token during logout");
                        return new InvalidRefreshTokenException("Invalid refresh token.");
                    });

            if (tokenEntity.getIsRevoked() != null && tokenEntity.getIsRevoked()) {
                log.warn("Already revoked token. Returning successfully (idempotent logout).");
                return;
            }

            tokenEntity.setIsRevoked(true);
            refreshTokenRepository.save(tokenEntity);

            log.info("Refresh token revoked successfully");
            log.info("Logout completed successfully");

        } catch (InvalidRefreshTokenException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected logout failure: {}", e.getMessage(), e);
            throw e;
        }
    }
}
