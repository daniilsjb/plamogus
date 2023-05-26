package lv.tsi.uap.server.component.auth.service;

import lombok.NonNull;
import lv.tsi.uap.server.component.auth.endpoint.AuthenticationLoginRequest;
import lv.tsi.uap.server.component.auth.endpoint.AuthenticationRegisterRequest;
import lv.tsi.uap.server.component.auth.endpoint.AuthenticationResponse;

public interface AuthenticationService {

    AuthenticationResponse register(@NonNull AuthenticationRegisterRequest request);

    AuthenticationResponse login(@NonNull AuthenticationLoginRequest request);

}
