package lv.tsi.uap.server.component.dashboard.service;

import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.component.assignment.service.Assignment;
import lv.tsi.uap.server.component.assignment.service.AssignmentRepository;
import lv.tsi.uap.server.component.dashboard.endpoint.DashboardResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DefaultDashboardService implements DashboardService {

    private final AssignmentRepository assignmentRepository;

    @Override
    public DashboardResponse index() {
        final var assignments = assignmentRepository.findAll();

        final var pendingCount = assignments.stream()
            .filter(it -> !it.getCompleted())
            .count();

        final var overdueCount = assignments.stream()
            .filter(it -> !it.getCompleted() &&
                it.getDeadlineTime() != null &&
                it.getDeadlineTime().isBefore(Instant.now()))
            .count();

        final var typeFrequencies = assignments.stream()
            .filter(it -> it.getType() != null)
            .collect(Collectors.groupingBy(Assignment::getType, Collectors.counting()))
            .entrySet().stream()
            .map(it -> DashboardResponse.TypeFrequency.builder()
                .type(it.getKey())
                .count(it.getValue())
                .build())
            .toList();

        final var semesterFrequencies = assignmentRepository.countAssignmentsBySemester()
            .stream()
            .map(it -> DashboardResponse.SemesterFrequency.builder()
                .semester((Integer)it[0])
                .count((Long)it[1])
                .build())
            .toList();

        final var deadlineFrequencies = assignments.stream()
            .filter(it -> !it.getCompleted() && it.getDeadlineTime() != null)
            .collect(Collectors.groupingBy(Assignment::getDeadlineTime, Collectors.counting()))
            .entrySet().stream()
            .map(it -> DashboardResponse.DeadlineFrequency.builder()
                .deadlineTime(it.getKey())
                .overdue(it.getKey().isBefore(Instant.now()))
                .count(it.getValue())
                .build())
            .toList();

        return DashboardResponse.builder()
            .pendingCount(pendingCount)
            .overdueCount(overdueCount)
            .types(typeFrequencies)
            .semesters(semesterFrequencies)
            .deadlines(deadlineFrequencies)
            .build();
    }

}