package lv.tsi.uap.server.component.dashboard.endpoint;

import lombok.Builder;
import lombok.Value;
import lv.tsi.uap.server.component.assignment.service.AssignmentType;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class DashboardResponse {

    Long pendingCount;
    Long overdueCount;
    List<TypeFrequency> types;
    List<SemesterFrequency> semesters;
    List<DeadlineFrequency> deadlines;

    @Value
    @Builder
    public static class TypeFrequency {

        AssignmentType type;
        Long count;

    }

    @Value
    @Builder
    public static class SemesterFrequency {

        Integer semester;
        Long count;

    }

    @Value
    @Builder
    public static class DeadlineFrequency {

        Instant deadlineTime;
        Boolean overdue;
        Long count;

    }

}
