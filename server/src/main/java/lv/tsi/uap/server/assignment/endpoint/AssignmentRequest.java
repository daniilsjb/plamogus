package lv.tsi.uap.server.assignment.endpoint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;
import lv.tsi.uap.server.assignment.service.AssignmentType;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
@Jacksonized
class AssignmentRequest {

    @NotBlank(message = "Attribute 'title' cannot be blank.")
    @Size(max = 64, message = "Attribute 'title' cannot exceed 64 characters.")
    String title;

    @Size(max = 512, message = "Attribute 'description' cannot exceed 512 characters.")
    String description;

    Instant deadlineTime;

    AssignmentType type;

    UUID courseId;

}
