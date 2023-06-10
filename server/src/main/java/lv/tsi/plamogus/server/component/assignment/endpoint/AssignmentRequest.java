package lv.tsi.plamogus.server.component.assignment.endpoint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;
import lv.tsi.plamogus.server.component.assignment.service.AssignmentType;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
@Jacksonized
class AssignmentRequest {

    @NotBlank(message = "Attribute 'title' cannot be blank.")
    @Size(max = 64, message = "Attribute 'title' cannot exceed 64 characters.")
    private final String title;

    @Size(max = 512, message = "Attribute 'description' cannot exceed 512 characters.")
    private final String description;

    private final Instant deadlineTime;
    private final AssignmentType type;
    private final UUID courseId;

}
