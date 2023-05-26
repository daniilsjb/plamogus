package lv.tsi.uap.server.component.auth.endpoint;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.component.auth.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthenticationResponse register(@Valid @RequestBody AuthenticationRegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@Valid @RequestBody AuthenticationLoginRequest request) {
        return service.login(request);
    }

}
