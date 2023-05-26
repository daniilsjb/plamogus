package lv.tsi.uap.server.component.auth.endpoint;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthenticationResponse {

    String token;

}
