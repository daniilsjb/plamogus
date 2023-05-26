package lv.tsi.uap.server.component.auth.endpoint;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthenticationLoginRequest {

    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Attribute 'username' may contain only letters, digits, and underscore.")
    @Size(max = 64, message = "Attribute 'username' cannot exceed 64 characters.")
    String username;

    @Size(min = 8, max = 128, message = "Attribute 'password' must be between 8 and 128 characters long.")
    String password;

}
