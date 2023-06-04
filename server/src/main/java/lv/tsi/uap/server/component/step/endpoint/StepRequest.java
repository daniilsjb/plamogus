package lv.tsi.uap.server.component.step.endpoint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
class StepRequest {

    @NotBlank(message = "Attribute 'title' cannot be blank.")
    @Size(max = 64, message = "Attribute 'title' cannot exceed 64 characters.")
    private final String title;

}
