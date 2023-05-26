package lv.tsi.uap.server.component.course.endpoint;

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
    String code;

    @NotBlank(message = "Attribute 'title' cannot be blank.")
    @Size(max = 64, message = "Attribute 'title' cannot exceed 64 characters.")
    String title;

    @Size(max = 1024, message = "Attribute 'description' cannot exceed 1024 characters.")
    String description;

    @Positive(message = "Attribute 'semester' must be positive.")
    Integer semester;

}
