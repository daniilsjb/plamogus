package lv.tsi.uap.server.component.auth.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.common.security.JwtService;
import lv.tsi.uap.server.component.auth.endpoint.AuthenticationLoginRequest;
import lv.tsi.uap.server.component.auth.endpoint.AuthenticationRegisterRequest;
import lv.tsi.uap.server.component.auth.endpoint.AuthenticationResponse;
import lv.tsi.uap.server.component.user.service.Role;
import lv.tsi.uap.server.component.user.service.User;
import lv.tsi.uap.server.component.user.service.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DefaultAuthenticationService implements AuthenticationService {

    private final JwtService jwtService;
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager manager;

    @Override
    public AuthenticationResponse register(@NonNull AuthenticationRegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with email '%s' already exists."
                .formatted(request.getEmail()));
        }

        if (repository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with username '%s' already exists."
                .formatted(request.getUsername()));
        }

        final var user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        repository.save(user);

        final var jwt = jwtService.createToken(user);
        return AuthenticationResponse.builder()
            .token(jwt)
            .build();
    }

    @Override
    public AuthenticationResponse login(@NonNull AuthenticationLoginRequest request) {
        manager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        final var user = repository.findByUsername(request.getUsername())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User with username '%s' does not exist."
                .formatted(request.getUsername())));

        final var jwt = jwtService.createToken(user);
        return AuthenticationResponse.builder()
            .token(jwt)
            .build();
    }

}
