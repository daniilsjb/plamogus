package lv.tsi.plamogus.server.component.assignment.endpoint;

import lombok.Builder;
import lombok.Value;
import lv.tsi.plamogus.server.component.assignment.service.AssignmentType;

import java.time.Instant;
import java.util.UUID;

@Value
@Builder
class AssignmentResponse {

    private final UUID id;
    private final String title;
    private final String description;
    private final Boolean completed;
    private final Instant creationTime;
    private final Instant deadlineTime;
    private final AssignmentType type;
    private final Course course;

    @Value
    @Builder
    public static class Course {

        private final UUID id;
        private final String code;

    }

}
