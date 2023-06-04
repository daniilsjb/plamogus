package lv.tsi.uap.server.component.dashboard.endpoint;

import lombok.Builder;
import lombok.Value;
import lv.tsi.uap.server.component.assignment.service.AssignmentType;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class DashboardResponse {

    private final Long pendingCount;
    private final Long overdueCount;
    private final List<TypeFrequency> types;
    private final List<SemesterFrequency> semesters;
    private final List<DeadlineFrequency> deadlines;

    @Value
    @Builder
    public static class TypeFrequency {

        private final AssignmentType type;
        private final Long count;

    }

    @Value
    @Builder
    public static class SemesterFrequency {

        private final Integer semester;
        private final Long count;

    }

    @Value
    @Builder
    public static class DeadlineFrequency {

        private final Instant deadlineTime;
        private final Boolean overdue;
        private final Long count;

    }

}
