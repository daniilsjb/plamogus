package lv.tsi.uap.server.component.assignment.endpoint;

import lombok.Builder;
import lombok.Value;
import lv.tsi.uap.server.component.assignment.service.AssignmentType;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
class AssignmentResponse {

    UUID id;
    String title;
    String description;
    Boolean completed;
    Instant creationTime;
    Instant deadlineTime;
    AssignmentType type;
    Course course;

    @Value
    @Builder
    public static class Course {

        UUID id;
        String code;

    }

}
