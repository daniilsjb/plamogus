package lv.tsi.plamogus.server.component.course.endpoint;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
class CourseRequest {

    @NotBlank(message = "Attribute 'code' cannot be blank.")
    @Size(max = 8, message = "Attribute 'code' cannot exceed 8 characters.")
    private final String code;

    @NotBlank(message = "Attribute 'title' cannot be blank.")
    @Size(max = 64, message = "Attribute 'title' cannot exceed 64 characters.")
    private final String title;

    @Size(max = 1024, message = "Attribute 'description' cannot exceed 1024 characters.")
    private final String description;

    @Positive(message = "Attribute 'semester' must be positive.")
    @Max(value = 99, message = "Attribute 'semester' cannot be larger than 99.")
    private final Integer semester;

}
